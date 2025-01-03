import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

import Facility from "@/entities/Facility";

type Data = {
    error?: string;
    success?: boolean;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export const parseFields =
    (req: NextApiRequest, res: NextApiResponse<Data>) =>
    async (err: any, fields: formidable.Fields<string>) => {
        // Variables
        const facility_id = parseInt(
            fields.facility_id?.[0].split("-")[1] ?? "",
        );
        const logo = fields.logo?.[0];
        const type = fields.type?.[0] || null;
        const location = fields.location?.[0] || null;
        const description = fields.description?.[0] || null;

        // Handle POST request
        if (req.method == "POST") {
            if (isNaN(facility_id)) {
                return res.json({ error: "Invalid Facility ID" });
            }
            if (await Facility.getByID(facility_id)) {
                return res.json({ error: `SITE-${facility_id} already exist` });
            }
            if (!logo) {
                return res.json({ error: "Logo is required" });
            }

            await Facility.create(
                facility_id,
                logo,
                type,
                location,
                description,
            );
            res.status(200).json({ success: true });
        }

        // Handle PATCH request
        if (req.method == "PATCH") {
            if (isNaN(facility_id)) {
                return res.json({ error: "Invalid Facility ID" });
            }
            if (!logo) {
                return res.json({ error: "Logo is required" });
            }

            await Facility.update(
                facility_id,
                logo,
                type,
                location,
                description,
            );
            res.status(200).json({ success: true });
        }

        // Handle DELETE request
        if (req.method == "DELETE") {
            const facility_id = parseInt(fields.facility_id?.[0] ?? "");

            if (isNaN(facility_id)) {
                return res.json({ error: "Invalid Facility ID" });
            }

            await Facility.delete(facility_id);
            res.status(200).json({ success: true });
        }
    };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const form = formidable();
    form.parse(req, parseFields(req, res));
}
