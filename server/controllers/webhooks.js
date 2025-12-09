import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString('utf-8');
    const headers = req.headers;
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let msg;
    try {
      msg = wh.verify(payload, headers);
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({});
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
          await User.create(userData);
          console.log("User created successfully");
          res.json({ success: true, message: "User created successfully" });
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
