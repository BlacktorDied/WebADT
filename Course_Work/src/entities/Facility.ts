import prisma from "@/prisma";
import Serializable from "./Serializable";

export default class Facility extends Serializable {
    private facility_id: number;
    private logo: string;
    private type: string | null;
    private location: string | null;
    private description: string | null;

    constructor(
        facility_id: number,
        logo: string,
        type: string | null,
        location: string | null,
        description: string | null,
    ) {
        super();
        this.facility_id = facility_id;
        this.logo = logo;
        this.type = type;
        this.location = location;
        this.description = description;
    }

    // Getters
    getId(): number {
        return this.facility_id;
    }
    getLogo(): string {
        return this.logo;
    }
    getType() {
        return this.type;
    }
    getLocation() {
        return this.location;
    }
    getDescription() {
        return this.description;
    }

    // Methods
    serialize(): string {
        return JSON.stringify({
            facility_id: this.facility_id,
            logo: this.logo,
            type: this.type,
            location: this.location,
            description: this.description,
        });
    }

    formatedId(): string {
        return this.facility_id.toString().padStart(2, "0");
    }

    // Static methods
    static deserialize(data: string): Facility {
        const { facility_id, logo, type, location, description } =
            JSON.parse(data);
        return new Facility(facility_id, logo, type, location, description);
    }

    static async getByID(facility_id: number): Promise<Facility | null> {
        const facility = await prisma.facility.findUnique({
            where: {
                facility_id: facility_id,
            },
        });

        if (!facility) {
            return null;
        }

        return new Facility(
            facility.facility_id,
            facility.logo,
            facility.type,
            facility.location,
            facility.description,
        );
    }

    static async getAll(): Promise<Facility[]> {
        const facilities = await prisma.facility.findMany();

        return facilities.map(
            (facility) =>
                new Facility(
                    facility.facility_id,
                    facility.logo,
                    facility.type,
                    facility.location,
                    facility.description,
                ),
        );
    }

    // Data Manupulating Methods
    static async create(
        facility_id: number,
        logo: string,
        type: string | null,
        location: string | null,
        description: string | null,
    ): Promise<void> {
        await prisma.facility.create({
            data: {
                facility_id,
                logo,
                type,
                location,
                description,
            },
        });
    }

    static async update(
        facility_id: number,
        logo: string,
        type: string | null,
        location: string | null,
        description: string | null,
    ): Promise<void> {
        await prisma.facility.update({
            where: {
                facility_id: facility_id,
            },
            data: {
                logo,
                type,
                location,
                description,
            },
        });
    }

    static async delete(facility_id: number): Promise<void> {
        await prisma.facility.delete({
            where: {
                facility_id: facility_id,
            },
        });
    }
}
