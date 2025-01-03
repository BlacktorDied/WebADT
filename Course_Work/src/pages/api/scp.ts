import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

import SCP from "@/entities/SCP";
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
        const scp_id = parseInt(fields.scp_id?.[0].split("-")[1] ?? "");
        const name = fields.name?.[0] || null;
        const photo = fields.photo?.[0] || null;
        const object_class = fields.object_class?.[0] || null;
        const containment = fields.containment?.[0] || null;
        const description = fields.description?.[0] || null;
        const facility_id = parseInt(fields.facility_id?.[0] ?? "");

        // Handle POST request
        if (req.method == "POST") {
            if (isNaN(scp_id)) {
                return res.json({ error: "Invalid SCP ID" });
            }
            if (await SCP.getByID(scp_id)) {
                return res.json({
                    error: `Item#: SCP-${scp_id} already exist`,
                });
            }
            if (
                isNaN(facility_id) ||
                (await Facility.getByID(facility_id)) === null
            ) {
                return res.json({ error: "Invalid Facility ID" });
            }
            await SCP.create(
                scp_id,
                name,
                photo,
                object_class,
                containment,
                description,
                facility_id,
            );
            res.status(200).json({ success: true });
        }

        // Handle PATCH request
        if (req.method == "PATCH") {
            if (isNaN(scp_id)) {
                return res.json({ error: "Invalid SCP ID" });
            }
            if (isNaN(facility_id) && !Facility.getByID(facility_id)) {
                return res.json({ error: "Invalid Facility ID" });
            }

            await SCP.update(
                scp_id,
                name,
                photo,
                object_class,
                containment,
                description,
                facility_id,
            );
            res.status(200).json({ success: true });
        }

        // Handle DELETE request
        if (req.method == "DELETE") {
            const scp_id = parseInt(fields.scp_id?.[0] ?? "");

            if (isNaN(scp_id)) {
                return res.json({ error: "Invalid SCP ID" });
            }

            await SCP.delete(scp_id);
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
