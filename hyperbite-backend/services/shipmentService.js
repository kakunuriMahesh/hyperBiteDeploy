const Order = require("../models/Order");
const shiprocketController = require("../controllers/shiprocketController");

const MAX_RETRIES = 3;

/**
 * Process a single order's shipment:
 * 1. Atomically transition PENDING → PROCESSING (prevents double-processing)
 * 2. Call ShipRocket API (via existing shiprocketController)
 * 3. Save response: CREATED on success, FAILED on failure (with retry logic)
 */
exports.processOrderShipment = async (orderId) => {
  const start = Date.now();
  console.log(`[ShipmentService] Processing order ${orderId}`);

  // Step 1: Atomically claim this order (PENDING → PROCESSING)
  const order = await Order.findOneAndUpdate(
    { _id: orderId, shipmentStatus: "PENDING" },
    { $set: { shipmentStatus: "PROCESSING", lastAttemptedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!order) {
    console.log(`[ShipmentService] Order ${orderId} not in PENDING state (skipped)`);
    return;
  }

  console.log(`[ShipmentService] Order ${orderId} claimed → PROCESSING`);

  // Validate required fields before calling ShipRocket
  const shipErrors = {};
  if (!(order.customer?.address || order.address)) {
    shipErrors.billing_address = "The billing address field is required";
  }
  if (!(order.customer?.phone || order.phone)) {
    shipErrors.phone = "The billing phone field is required";
  }
  if (!(order.customer?.name || order.name)) {
    shipErrors.name = "The billing name field is required";
  }
  if (Object.keys(shipErrors).length > 0) {
    throw {
      statusCode: 422,
      message: "Validation failed - order missing required fields",
      shiprocketResponse: { errors: shipErrors }
    };
  }

  // Step 2: Call ShipRocket
  try {
    const result = await shiprocketController.createShiprocketOrder(order);
    console.log(`[ShipmentService] ShipRocket success for order ${orderId}:`, JSON.stringify(result));

    // Step 3a: Save successful response
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        shipmentStatus: "CREATED",
        shiprocketShipmentId: result.shipment_id || result.id,
        courierName: result.courier_name,
        awbCode: result.awb_code,
        trackingUrl: result.tracking_url,
        shiprocketCreatedAt: new Date(),
        shiprocketError: null
      }
    });

    console.log(`[ShipmentService] Order ${orderId} → CREATED (${Date.now() - start}ms)`);
  } catch (err) {
    // Capture enhanced Shiprocket error detail from shiprocketService
    const errorMessage = err.shiprocketResponse?.message || err.message || String(err);
    const errorDetail = err.shiprocketResponse?.errors || {};
    const combined = errorMessage + (Object.keys(errorDetail).length ? ' | ' + JSON.stringify(errorDetail) : '');

    console.error(`[ShipmentService] ShipRocket failed for order ${orderId}:`, combined);

    // Step 3b: Handle failure with retry count
    const retryCount = (order.retryCount || 0) + 1;

    if (retryCount >= MAX_RETRIES) {
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          shipmentStatus: "FAILED",
          shiprocketError: combined,
          retryCount
        }
      });
      console.error(`[ShipmentService] Order ${orderId} → FAILED (retries exhausted: ${retryCount}/${MAX_RETRIES})`);
    } else {
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          shipmentStatus: "PENDING",
          shiprocketError: combined,
          retryCount
        }
      });
      console.log(`[ShipmentService] Order ${orderId} back to PENDING (retry ${retryCount}/${MAX_RETRIES})`);
    }
  }
};
