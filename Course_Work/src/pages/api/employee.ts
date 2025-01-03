import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

import Employee from "@/entities/Employee";
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

const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

export const parseFields =
    (req: NextApiRequest, res: NextApiResponse<Data>) =>
    async (err: any, fields: formidable.Fields<string>) => {
        // Variables
        const emp_id = parseInt(fields.emp_id?.[0] ?? "");
        const name = fields.name?.[0];
        const dobString = fields.dob?.[0] || null;
        const dob =
            dobString && isValidDate(dobString) ? new Date(dobString) : null;
        const sex = fields.sex?.[0] || null;
        const position = fields.position?.[0];
        const description = fields.description?.[0] || null;
        const facility_id = parseInt(fields.facility_id?.[0] ?? "");

        // Handle POST request
        if (req.method == "POST") {
            if (!name) {
                return res.json({ error: "Name is required" });
            }
            if (!position) {
                return res.json({ error: "Position is required" });
            }
            if (
                isNaN(facility_id) ||
                (await Facility.getByID(facility_id)) === null
            ) {
                return res.json({ error: "Invalid Facility ID" });
            }

            await Employee.create(
                name,
                dob,
                sex,
                position,
                description,
                facility_id,
            );
            res.status(200).json({ success: true });
        }

        // Handle PATCH request
        if (req.method == "PATCH") {
            if (!name) {
                return res.json({ error: "Name is required" });
            }
            if (!position) {
                return res.json({ error: "Position is required" });
            }
            if (isNaN(facility_id) && !Facility.getByID(facility_id)) {
                return res.json({ error: "Invalid Facility ID" });
            }

            await Employee.update(
                emp_id,
                name,
                dob,
                sex,
                position,
                description,
                facility_id,
            );
            res.status(200).json({ success: true });
        }

        // Handle DELETE request
        if (req.method == "DELETE") {
            if (isNaN(emp_id)) {
                return res.json({ error: "Invalid Employee ID" });
            }

            await Employee.delete(emp_id);
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
