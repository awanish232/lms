import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString();
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const msg = wh.verify(payload, headers);

    const { data, type } = msg;

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        return res.json({ success: true });

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        return res.json({ success: true });

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });

      default:
        return res.json({ received: true });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
