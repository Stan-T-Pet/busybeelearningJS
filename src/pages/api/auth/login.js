import { signIn } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await signIn("credentials", {
      redirect: false,
      email: req.body.email,
      password: req.body.password,
    });

    if (response.error) {
      return res.status(401).json({ error: response.error });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
