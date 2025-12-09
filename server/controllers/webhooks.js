import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString('utf-8');
    const headers = req.headers;
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let msg;
    console.log("Webhook received!");
    console.log("Headers:", headers);
    console.log("Payload:", payload);
    try {
      msg = wh.verify(payload, headers);
      console.log("Webhook verified successfully:", msg);
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).json({ success: false, message: "Webhook verification failed" });
    }

    const { data, type } = msg;
    console.log(`Webhook of type ${type} received`);
    switch (type) {
      case "user.created":
        {
          const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            name: data.first_name + " " + data.last_name,
            imageUrl: data.image_url,
          };
          console.log("User data to be created:", userData);
          try {
            await User.create(userData);
            console.log("User created successfully in database");
            res.json({ success: true, message: "User created successfully" });
          } catch (dbError) {
            console.error("Error creating user in database:", dbError.message);
            res.status(500).json({ success: false, message: "Error creating user in database" });
          }
          break;
        }
      case "user.updated":
        {
          const userData = {
            email: data.email_addresses[0].email_address,
            name: data.first_name + " " + data.last_name,
            imageUrl: data.image_url,
          };
          await User.findByIdAndUpdate(data.id, userData);
          console.log("User updated successfully");
          res.json({ success: true, message: "User updated successfully" });
          break;
        }
      case "user.deleted":
        {
          await User.findByIdAndDelete(data.id);
          console.log("User deleted successfully");
          res.json({ success: true, message: "User deleted successfully" });
          break;
        }

      default:
        break;
    }
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
