import prisma from "@/prisma";
import Serializable from "./Serializable";

export default class Employee extends Serializable {
    private emp_id: number;
    private name: string;
    private dob: Date | null;
    private sex: string | null;
    private position: string;
    private description: string | null;
    private facility_id: number;

    constructor(
        emp_id: number,
        name: string,
        dob: Date | null,
        sex: string | null,
        position: string,
        description: string | null,
        facility_id: number,
    ) {
        super();
        this.emp_id = emp_id;
        this.name = name;
        this.dob = dob;
        this.sex = sex;
        this.position = position;
        this.description = description;
        this.facility_id = facility_id;
    }

    // Getters
    getId(): number {
        return this.emp_id;
    }
    getName(): string {
        return this.name;
    }
    getDOB() {
        return this.dob;
    }
    getSex() {
        return this.sex;
    }
    getPosition(): string {
        return this.position;
    }
    getDescription() {
        return this.description;
    }
    getFacilityId() {
        return this.facility_id;
    }

    // Methods
    serialize(): string {
        return JSON.stringify({
            emp_id: this.emp_id,
            name: this.name,
            dob: this.dob,
            sex: this.sex,
            position: this.position,
            description: this.description,
            facility_id: this.facility_id,
        });
    }

    // Static methods
    static deserialize(data: string): Employee {
        const { emp_id, name, dob, sex, position, description, facility_id } =
            JSON.parse(data);
        return new Employee(
            emp_id,
            name,
            dob,
            sex,
            position,
            description,
            facility_id,
        );
    }

    static async getByID(emp_id: number): Promise<Employee | null> {
        const employee = await prisma.employee.findUnique({
            where: {
                emp_id: emp_id,
            },
        });

        if (!employee) {
            return null;
        }

        return new Employee(
            employee.emp_id,
            employee.name,
            employee.dob,
            employee.sex,
            employee.position,
            employee.description,
            employee.facility_id,
        );
    }

    static async getAll(): Promise<Employee[]> {
        const Employees = await prisma.employee.findMany();

        return Employees.map(
            (employee) =>
                new Employee(
                    employee.emp_id,
                    employee.name,
                    employee.dob,
                    employee.sex,
                    employee.position,
                    employee.description,
                    employee.facility_id,
                ),
        );
    }

    // Data Manupulating Methods
    static async create(
        name: string,
        dob: Date | null,
        sex: string | null,
        position: string,
        description: string | null,
        facility_id: number,
    ): Promise<void> {
        await prisma.employee.create({
            data: {
                name,
                dob,
                sex,
                position,
                description,
                facility_id,
            },
        });
    }

    static async update(
        emp_id: number,
        name: string,
        dob: Date | null,
        sex: string | null,
        position: string,
        description: string | null,
        facility_id: number,
    ): Promise<void> {
        await prisma.employee.update({
            where: {
                emp_id: emp_id,
            },
            data: {
                name,
                dob,
                sex,
                position,
                description,
                facility_id,
            },
        });
    }

    static async delete(emp_id: number): Promise<void> {
        await prisma.employee.delete({
            where: {
                emp_id: emp_id,
            },
        });
    }
}
