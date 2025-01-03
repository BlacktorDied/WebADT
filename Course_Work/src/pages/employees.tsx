import styles from "@/styles/Employees.module.scss";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useLoggedIn } from "@/hooks";

import Edit from "@/icons/pencil.svg";
import Bin from "@/icons/bin.svg";
import Plus from "@/icons/plus.svg";
import Close from "@/icons/close.svg";

import Employee from "@/entities/Employee";
import Facility from "@/entities/Facility";

// Get all Employees
type Props = {
    employees: string[];
    facilities: number[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const employees = await Employee.getAll();
    const facilities = await Facility.getAll();

    return {
        props: {
            employees: employees.map((employee) => employee.serialize()),
            facilities: facilities.map((facility) => facility.getId()),
        },
    };
};

export default function SCPs({ employees, facilities }: Props) {
    const [addHidden, setAddHidden] = useState<boolean>(true);
    const [updateHidden, setUpdateHidden] = useState<number>();
    const [descHidden, setDescHidden] = useState<number>();
    const [filter, setFilter] = useState<string>("");
    const [sortBy, setSort] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const list = employees.map(Employee.deserialize);
    const loggedIn = useLoggedIn();

    const handleFilterChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setFilter(event.target.value);
    };
    const handleSortByChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSort(event.target.value);
    };
    const handleSortOrderChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSortOrder(event.target.value);
    };

    // Add new Employee
    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/employee", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    };
    // Update existing Employee
    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/employee", {
            method: "PATCH",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    };
    // Delete Employee
    const handleDelete = async (emp_id: number) => {
        const formData = new FormData();
        formData.append("emp_id", emp_id.toString());

        const response = await fetch("/api/employee", {
            method: "DELETE",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    };

    return (
        <section className="container">
            <div className={styles.main}>
                <h1 className={styles.main__title}>List of all Employees</h1>

                <div className={styles.filterSort}>
                    <label htmlFor="filter">
                        <strong>Filter by Position: </strong>
                        <select
                            className={styles.filterSort__filter}
                            onChange={handleFilterChange}
                        >
                            <option value=""></option>
                            <option value="AIC">AIC</option>
                            <option value="Agent">Agent</option>
                            <option value="Chief">Chief</option>
                            <option value="D-Class">D-Class</option>
                            <option value="Director">Director</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Professor">Professor</option>
                            <option value="Researcher">Researcher</option>
                            <option value="Other Personnel">
                                Other Personnel
                            </option>
                        </select>
                    </label>
                    <div className={styles.filterSort__sort}>
                        <label htmlFor="sortBy">
                            <strong>Sort by: </strong>
                            <select
                                className={styles.filterSort__sortBy}
                                onChange={handleSortByChange}
                            >
                                <option value=""></option>
                                <option value="id">ID</option>
                                <option value="name">Name</option>
                                <option value="dob">DOB</option>
                                <option value="sex">Sex</option>
                                <option value="position">Position</option>
                                <option value="facility_id">Facility</option>
                            </select>
                        </label>
                        <label htmlFor="sortOrder">
                            <strong>Order: </strong>
                            <select
                                className={styles.filterSort__sortOrder}
                                onChange={handleSortOrderChange}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className={styles.main__cards}>
                    {list
                        .filter((employee) =>
                            filter ? employee.getPosition() == filter : true,
                        )
                        .toSorted((a, b) => {
                            switch (sortBy) {
                                case "id":
                                    return sortOrder == "asc"
                                        ? a.getId() - b.getId()
                                        : b.getId() - a.getId();
                                case "name":
                                    return sortOrder == "asc"
                                        ? a.getName().localeCompare(b.getName())
                                        : b
                                              .getName()
                                              .localeCompare(a.getName());
                                case "sex":
                                    return sortOrder == "asc"
                                        ? (a.getSex() ?? "").localeCompare(
                                              b.getSex() ?? "",
                                          )
                                        : (b.getSex() ?? "").localeCompare(
                                              a.getSex() ?? "",
                                          );
                                case "position":
                                    return sortOrder == "asc"
                                        ? a
                                              .getPosition()
                                              .localeCompare(b.getPosition())
                                        : b
                                              .getPosition()
                                              .localeCompare(a.getPosition());
                                case "facility_id":
                                    return sortOrder == "asc"
                                        ? a.getFacilityId() - b.getFacilityId()
                                        : b.getFacilityId() - a.getFacilityId();
                                case "dob":
                                    return sortOrder == "asc"
                                        ? (a.getDOB()?.getTime() ?? 0) -
                                              (b.getDOB()?.getTime() ?? 0)
                                        : (b.getDOB()?.getTime() ?? 0) -
                                              (a.getDOB()?.getTime() ?? 0);
                                default:
                                    return 0;
                            }
                        })
                        .map((employee) => (
                            <div key={employee.getId()}>
                                {updateHidden == employee.getId() ? (
                                    <div className={styles.form__wrapper}>
                                        <Close
                                            className={styles.form__close}
                                            onClick={() =>
                                                setUpdateHidden(undefined)
                                            }
                                        />
                                        <form
                                            className={styles.form}
                                            onSubmit={handleUpdate}
                                        >
                                            <label htmlFor="emp_id">
                                                <input
                                                    type="hidden"
                                                    name="emp_id"
                                                    id="emp_id"
                                                    value={employee.getId()}
                                                />
                                            </label>

                                            <label htmlFor="name">
                                                <strong>Name: </strong>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    defaultValue={employee.getName()}
                                                    required
                                                />
                                            </label>

                                            <label htmlFor="dob">
                                                <strong>Date of Birth: </strong>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    id="dob"
                                                    defaultValue={
                                                        employee.getDOB()
                                                            ? new Date(
                                                                  employee.getDOB() ??
                                                                      "",
                                                              )
                                                                  .toISOString()
                                                                  .split("T")[0]
                                                            : undefined
                                                    }
                                                />
                                            </label>

                                            <label htmlFor="sex">
                                                <strong>Sex: </strong>
                                                <select
                                                    name="sex"
                                                    id="sex"
                                                    defaultValue={
                                                        employee.getSex() ??
                                                        undefined
                                                    }
                                                >
                                                    <option value=""></option>
                                                    <option value="Male">
                                                        Male
                                                    </option>
                                                    <option value="Female">
                                                        Female
                                                    </option>
                                                </select>
                                            </label>

                                            <label htmlFor="position">
                                                <strong>Position: </strong>
                                                <input
                                                    type="text"
                                                    name="position"
                                                    id="position"
                                                    defaultValue={employee.getPosition()}
                                                    required
                                                />
                                            </label>

                                            <label htmlFor="description">
                                                <strong>Description: </strong>
                                            </label>
                                            <textarea
                                                name="description"
                                                id="description"
                                                defaultValue={
                                                    employee.getDescription() ??
                                                    undefined
                                                }
                                            />

                                            <label
                                                className={
                                                    styles.form__requried
                                                }
                                                htmlFor="facility_id"
                                            >
                                                <strong>Facility ID: </strong>
                                                <select
                                                    name="facility_id"
                                                    id="facility_id"
                                                    defaultValue={employee.getFacilityId()}
                                                    required
                                                >
                                                    <option value=""></option>
                                                    {facilities.map(
                                                        (facility) => (
                                                            <option
                                                                key={facility}
                                                                value={facility}
                                                            >
                                                                Site-
                                                                {facility
                                                                    .toString()
                                                                    .padStart(
                                                                        2,
                                                                        "0",
                                                                    )}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </label>

                                            <button type="submit">
                                                Update
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className={styles.card}>
                                        <div className={styles.card__top}>
                                            <div
                                                title={
                                                    !loggedIn
                                                        ? "Log in to edit"
                                                        : "Edit Employee"
                                                }
                                            >
                                                <Edit
                                                    className={`${styles.card__topEdit} ${
                                                        !loggedIn &&
                                                        styles.card__topEdit_disabled
                                                    }`}
                                                    onClick={() =>
                                                        loggedIn &&
                                                        setUpdateHidden(
                                                            employee.getId(),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                title={
                                                    !loggedIn
                                                        ? "Log in to delete"
                                                        : "Delete Employee"
                                                }
                                            >
                                                <Bin
                                                    className={`${styles.card__topDelete} ${
                                                        !loggedIn &&
                                                        styles.card__topDelete_disabled
                                                    }`}
                                                    onClick={() =>
                                                        loggedIn &&
                                                        handleDelete(
                                                            employee.getId(),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.card__bottom}>
                                            <div
                                                className={
                                                    styles.card__bottomTexts
                                                }
                                            >
                                                <h2
                                                    className={
                                                        styles.card__bottomTitle
                                                    }
                                                >
                                                    <strong>
                                                        {employee.getPosition()}{" "}
                                                        {employee.getName()}:{" "}
                                                    </strong>
                                                    {employee.getDescription()}
                                                </h2>
                                                <br />
                                                <p
                                                    className={
                                                        styles.card__bottomDOB
                                                    }
                                                >
                                                    <strong>
                                                        Date of Birth:{" "}
                                                    </strong>
                                                    {employee.getDOB()
                                                        ? new Date(
                                                              employee.getDOB() ??
                                                                  "",
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  year: "numeric",
                                                                  month: "2-digit",
                                                                  day: "2-digit",
                                                              },
                                                          )
                                                        : undefined}
                                                </p>
                                                <p
                                                    className={
                                                        styles.card__bottomSex
                                                    }
                                                >
                                                    <strong>Sex: </strong>
                                                    {employee.getSex() ??
                                                        undefined}
                                                </p>
                                                <p
                                                    className={
                                                        styles.card__bottomFacility
                                                    }
                                                >
                                                    <strong>Facility: </strong>
                                                    SITE-
                                                    {employee
                                                        .getFacilityId()
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    <div className={styles.card__add}>
                        {addHidden ? (
                            loggedIn && (
                                <Plus
                                    className={styles.card__addImage}
                                    onClick={() => setAddHidden(false)}
                                />
                            )
                        ) : (
                            <div className={styles.form__wrapper}>
                                <Close
                                    className={styles.form__close}
                                    onClick={() => setAddHidden(true)}
                                />
                                <form
                                    className={styles.form}
                                    onSubmit={handleAdd}
                                >
                                    <label
                                        htmlFor="name"
                                        className={styles.form__requried}
                                    >
                                        <strong>Name: </strong>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                        />
                                    </label>
                                    <label htmlFor="dob">
                                        <strong>Date of Birth: </strong>
                                        <input
                                            type="date"
                                            name="dob"
                                            id="dob"
                                        />
                                    </label>
                                    <label htmlFor="sex">
                                        <strong>Sex: </strong>
                                        <select name="sex" id="sex">
                                            <option value=""></option>
                                            <option value="Female">
                                                Female
                                            </option>
                                            <option value="Male">Male</option>
                                        </select>
                                    </label>
                                    <label
                                        htmlFor="position"
                                        className={styles.form__requried}
                                    >
                                        <strong>Position: </strong>
                                        <select
                                            name="position"
                                            id="position"
                                            required
                                        >
                                            <option value=""></option>
                                            <option value="AIC">AIC</option>
                                            <option value="Agent">Agent</option>
                                            <option value="Chief">Chief</option>
                                            <option value="D-Class">
                                                D-Class
                                            </option>
                                            <option value="Director">
                                                Director
                                            </option>
                                            <option value="Doctor">
                                                Doctor
                                            </option>
                                            <option value="Professor">
                                                Professor
                                            </option>
                                            <option value="Researcher">
                                                Researcher
                                            </option>
                                            <option value="Other Personnel">
                                                Other Personnel
                                            </option>
                                        </select>
                                    </label>
                                    <label htmlFor="description">
                                        <strong>Description: </strong>
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                    />
                                    <label
                                        className={styles.form__requried}
                                        htmlFor="facility_id"
                                    >
                                        <strong>Facility ID: </strong>
                                        <select
                                            name="facility_id"
                                            id="facility_id"
                                            required
                                        >
                                            <option value=""></option>
                                            {facilities.map((facility_id) => (
                                                <option
                                                    key={facility_id}
                                                    value={facility_id}
                                                >
                                                    SITE-
                                                    {facility_id
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <button type="submit">Add</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
