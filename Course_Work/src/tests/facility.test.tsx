import { NextApiRequest, NextApiResponse } from "next";
import { parseFields } from "@/pages/api/facility";
import Facility from "@/entities/Facility";

jest.mock("@/entities/Facility");

describe("API Facility Handler", () => {
    let req: NextApiRequest;
    let res: NextApiResponse;

    beforeEach(() => {
        req = {
            method: "",
            body: {},
        } as unknown as NextApiRequest;

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as NextApiResponse;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Post, Patch, Delete reuquest tests
    it("should handle POST request", async () => {
        req.method = "POST";
        req.body = {
            facility_id: ["SITE-999"],
            logo: ["logo.png"],
            type: ["type"],
            location: ["location"],
            description: ["description"],
        };

        (Facility.getByID as jest.Mock).mockResolvedValue(null);
        (Facility.create as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(Facility.getByID).toHaveBeenCalledWith(999);
        expect(Facility.create).toHaveBeenCalledWith(
            999,
            "logo.png",
            "type",
            "location",
            "description",
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it("should handle PATCH request", async () => {
        req.method = "PATCH";
        req.body = {
            facility_id: ["SITE-999"],
            logo: ["logo.png"],
            type: ["type"],
            location: ["location"],
            description: ["description"],
        };

        (Facility.update as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(Facility.update).toHaveBeenCalledWith(
            999,
            "logo.png",
            "type",
            "location",
            "description",
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it("should handle DELETE request", async () => {
        req.method = "DELETE";
        req.body = {
            facility_id: ["999"],
        };

        (Facility.delete as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(Facility.delete).toHaveBeenCalledWith(999);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    // Error handling tests
    it("should return error if Facility ID is missing", async () => {
        req.method = "POST";
        req.body = {
            logo: ["logo.png"],
            type: ["type"],
            location: ["location"],
            description: ["description"],
        };

        (Facility.getByID as jest.Mock).mockResolvedValue(null);
        (Facility.create as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({ error: "Invalid Facility ID" });
    });
    it("should return error if Facility already exists", async () => {
        req.method = "POST";
        req.body = {
            facility_id: ["SITE-999"],
            logo: ["logo.png"],
            type: ["type"],
            location: ["location"],
            description: ["description"],
        };

        (Facility.getByID as jest.Mock).mockResolvedValue(999);
        (Facility.create as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({
            error: req.body.facility_id + ` already exist`,
        });
    });
    it("should return error if logo is missing", async () => {
        req.method = "POST";
        req.body = {
            facility_id: ["SITE-999"],
            type: ["type"],
            location: ["location"],
            description: ["description"],
        };

        (Facility.getByID as jest.Mock).mockResolvedValue(null);
        (Facility.create as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({ error: "Logo is required" });
    });
});
