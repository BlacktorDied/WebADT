import prisma from "@/prisma";
import Serializable from "./Serializable";

export default class SCP extends Serializable {
    private scp_id: number;
    private name: string | null;
    private photo: string | null;
    private objectClass: string | null;
    private containment: string | null;
    private description: string | null;
    private facility_id: number;

    constructor(
        scp_id: number,
        name: string | null,
        photo: string | null,
        objectClass: string | null,
        containment: string | null,
        description: string | null,
        facility_id: number,
    ) {
        super();
        this.scp_id = scp_id;
        this.name = name;
        this.photo = photo;
        this.objectClass = objectClass;
        this.containment = containment;
        this.description = description;
        this.facility_id = facility_id;
    }

    // Getters
    getId(): number {
        return this.scp_id;
    }
    getName() {
        return this.name;
    }
    getPhoto() {
        return this.photo;
    }
    getObjectClass() {
        return this.objectClass;
    }
    getContainment() {
        return this.containment;
    }
    getDescription() {
        return this.description;
    }
    getFacilityId(): number {
        return this.facility_id;
    }

    // Methods
    serialize(): string {
        return JSON.stringify({
            scp_id: this.scp_id,
            name: this.name,
            photo: this.photo,
            objectClass: this.objectClass,
            containment: this.containment,
            description: this.description,
            facility_id: this.facility_id,
        });
    }

    formatedId(): string {
        return this.scp_id.toString().padStart(3, "0");
    }

    // Static methods
    static deserialize(data: string): SCP {
        const {
            scp_id,
            name,
            photo,
            objectClass,
            containment,
            description,
            facility_id,
        } = JSON.parse(data);
        return new SCP(
            scp_id,
            name,
            photo,
            objectClass,
            containment,
            description,
            facility_id,
        );
    }

    static async getByID(scp_id: number): Promise<SCP | null> {
        const scp = await prisma.sCP.findUnique({
            where: {
                scp_id: scp_id,
            },
        });

        if (!scp) {
            return null;
        }

        return new SCP(
            scp.scp_id,
            scp.name,
            scp.photo,
            scp.objectClass,
            scp.containment,
            scp.description,
            scp.facility_id,
        );
    }

    static async getAll(): Promise<SCP[]> {
        const scps = await prisma.sCP.findMany();
        return scps.map(
            (scp) =>
                new SCP(
                    scp.scp_id,
                    scp.name,
                    scp.photo,
                    scp.objectClass,
                    scp.containment,
                    scp.description,
                    scp.facility_id,
                ),
        );
    }

    // Data Manupulating Methods
    static async create(
        scp_id: number,
        name: string | null,
        photo: string | null,
        objectClass: string | null,
        containment: string | null,
        description: string | null,
        facility_id: number,
    ): Promise<SCP> {
        const scp = await prisma.sCP.create({
            data: {
                scp_id: scp_id,
                name: name,
                photo: photo,
                objectClass: objectClass,
                containment: containment,
                description: description,
                facility_id: facility_id,
            },
        });

        return new SCP(
            scp.scp_id,
            scp.name,
            scp.photo,
            scp.objectClass,
            scp.containment,
            scp.description,
            scp.facility_id,
        );
    }

    static async update(
        scp_id: number,
        name: string | null,
        photo: string | null,
        objectClass: string | null,
        containment: string | null,
        description: string | null,
        facility_id: number,
    ): Promise<SCP> {
        const scp = await prisma.sCP.update({
            where: {
                scp_id: scp_id,
            },
            data: {
                name: name,
                photo: photo,
                objectClass: objectClass,
                containment: containment,
                description: description,
                facility_id: facility_id,
            },
        });

        return new SCP(
            scp.scp_id,
            scp.name,
            scp.photo,
            scp.objectClass,
            scp.containment,
            scp.description,
            scp.facility_id,
        );
    }

    static async delete(scp_id: number): Promise<void> {
        await prisma.sCP.delete({
            where: {
                scp_id: scp_id,
            },
        });
    }
}
