import { NextApiRequest, NextApiResponse } from "next";
import { parseFields } from "@/pages/api/employee";
import Employee from "@/entities/Employee";
import Facility from "@/entities/Facility";

jest.mock("@/entities/Employee");
jest.mock("@/entities/Facility");

describe("API Employee Handler", () => {
    const body = {
        emp_id: ["999"],
        name: ["name"],
        dob: ["2021-01-01"],
        sex: ["sex"],
        position: ["position"],
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

        const facility_id = parseInt(req.body.facility_id[0]);

        (Facility.getByID as jest.Mock).mockResolvedValue(facility);
        (Employee.create as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(Facility.getByID).toHaveBeenCalledWith(facility_id);
        expect(Employee.create).toHaveBeenCalledWith(
            "name",
            new Date("2021-01-01"),
            "sex",
            "position",
            "description",
            facility_id,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it("should handle PATCH request", async () => {
        req.method = "PATCH";

        const emp_id = parseInt(req.body.emp_id[0]);
        const facility_id = parseInt(req.body.facility_id[0]);

        await parseFields(req, res)(undefined, req.body);

        (Employee.update as jest.Mock).mockResolvedValue(undefined);

        expect(Employee.update).toHaveBeenCalledWith(
            emp_id,
            "name",
            new Date("2021-01-01"),
            "sex",
            "position",
            "description",
            facility_id,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
    it("should handle DELETE request", async () => {
        req.method = "DELETE";
        req.body = {
            emp_id: ["999"],
        };

        (Employee.delete as jest.Mock).mockResolvedValue(undefined);

        await parseFields(req, res)(undefined, req.body);

        expect(Employee.delete).toHaveBeenCalledWith(999);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    // Error handling tests
    it("should return error if Name is missing", async () => {
        req.method = "POST";
        req.body.name = [];

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
    });
    it("should return error if Position is missing", async () => {
        req.method = "POST";
        req.body = {
            name: ["name"],
            position: [],
            facility_id: ["999"],
        };

        await parseFields(req, res)(undefined, req.body);

        expect(res.json).toHaveBeenCalledWith({
            error: "Position is required",
        });
    });
    it("should return error if Facility ID is invalid", async () => {
        req.method = "POST";
        req.body = {
            name: ["name"],
            position: ["position"],
            facility_id: ["999"],
        };

        (Facility.getByID as jest.Mock).mockResolvedValue(null);

        await parseFields(req, res)(undefined, req.body);

        expect(Facility.getByID).toHaveBeenCalledWith(999);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid Facility ID" });
    });
});
