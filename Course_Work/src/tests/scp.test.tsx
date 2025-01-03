import { NextApiRequest, NextApiResponse } from "next";
import { parseFields } from "@/pages/api/scp";
import SCP from "@/entities/SCP";
import Facility from "@/entities/Facility";

jest.mock("@/entities/SCP");
jest.mock("@/entities/Facility");

describe("API SCP Handler", () => {
    const body = {
        scp_id: ["SCP-999"],
        name: ["name"],
        photo: ["photo.png"],
        object_class: ["object_class"],
        containment: ["containment"],
        description: ["description"],
        facility_id: ["999"],
    } as const;
    let req: NextApiRequest & { body: typeof body };
    let res: NextApiResponse;
    let facility: Facility;

    beforeEach(() => {
        req = {
            method: "",
            body,
        } as unknown as NextApiRequest & { body: typeof body };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as NextApiResponse;

        facility = new Facility(
            999,
            "logo.png",
            "type",
            "location",
            "description",
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Post, Patch, Delete reuquest tests
    it("should handle POST request", async () => {
        req.method = "POST";

        const scp_id: number = +req.body.scp_id[0].split("-").pop();
        const facility_id = parseInt(req.body.facility_id[0]);

        await parseFields(req, res)(undefined, req.body);

        (SCP.getByID as jest.Mock).mockResolvedValue(null);
        (Facility.getByID as jest.Mock).mockResolvedValue(true);

        expect(SCP.getByID).toHaveBeenCalledWith(scp_id);
        expect(Facility.getByID).toHaveBeenCalledWith(facility_id);
        expect(SCP.create).toHaveBeenCalledWith(
            scp_id,
            "name",
            "photo.png",
            "object_class",
            "containment",
            "description",
            facility_id,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it("should handle PATCH request", async () => {
        req.method = "PATCH";

        const scp_id: number = +req.body.scp_id[0].split("-").pop();
        const facility_id = parseInt(req.body.facility_id[0]);

        await parseFields(req, res)(undefined, req.body);

        (SCP.update as jest.Mock).mockResolvedValue(undefined);

        expect(SCP.update).toHaveBeenCalledWith(
            scp_id,
            "name",
            "photo.png",
            "object_class",
            "containment",
            "description",
            facility_id,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it("should handle DELETE request", async () => {
        req.method = "DELETE";
        req.body = {
            scp_id: ["999"],
        };

        const scp_id: number = +req.body.scp_id[0].split("-").pop();

        (SCP.delete as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(SCP.delete).toHaveBeenCalledWith(scp_id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    // Error handling tests
    it("should return error if SCP ID is invalid", async () => {
        req.method = "POST";
        req.body = {
            scp_id: ["SCP-"],
        };

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({ error: "Invalid SCP ID" });
    });
    it("should return error if SCP already exists", async () => {
        req.method = "POST";
        req.body = {
            scp_id: ["SCP-999"],
        };

        (SCP.getByID as jest.Mock).mockResolvedValue(true);

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({
            error: `Item#: ${req.body.scp_id[0]} already exist`,
        });
    });
    it("should return error if Facility ID is invalid", async () => {
        req.method = "POST";
        req.body = {
            scp_id: ["SCP-999"],
            facility_id: ["999"],
        };

        (SCP.getByID as jest.Mock).mockResolvedValue(null);
        (Facility.getByID as jest.Mock).mockResolvedValue(null);

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({ error: "Invalid Facility ID" });
    });
});
