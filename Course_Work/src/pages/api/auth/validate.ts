import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type Data = {
    success?: boolean;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const body = req.body;

    if (typeof body === "string") {
        const [username, hashReceived] = body.split(":");

        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (user) {
            const hash = crypto
                .createHash("sha256")
                .update(user.password)
                .digest("hex");

            if (hash === hashReceived) {
                return res.status(200).json({ success: true });
            }
        }
    }

    return res.status(200).json({ success: false });
}
