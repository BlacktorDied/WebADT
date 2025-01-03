import styles from "@/styles/SCPs.module.scss";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { useLoggedIn } from "@/hooks";
import Link from "next/link";

import Edit from "@/icons/pencil.svg";
import Bin from "@/icons/bin.svg";
import Plus from "@/icons/plus.svg";
import Close from "@/icons/close.svg";

import SCP from "@/entities/SCP";
import Facility from "@/entities/Facility";

//Get all SCPs
type Props = {
    scps: string[];
    facilities: number[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const scps = await SCP.getAll();
    const facilities = await Facility.getAll();

    return {
        props: {
            scps: scps.map((scp) => scp.serialize()),
            facilities: facilities.map((facility) => facility.getId()),
        },
    };
};

export default function SCPs({ scps, facilities }: Props) {
    const [addHidden, setAddHidden] = useState<boolean>(true);
    const [updateHidden, setUpdateHidden] = useState<number>();
    const [filter, setFilter] = useState<string>("");
    const [sortBy, setSort] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const list = scps.map(SCP.deserialize);
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

    // Add new SCP
    async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/scp", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    }
    // Update SCP
    async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/scp", {
            method: "PATCH",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    }
    // Delete SCP
    async function handleDelete(scp_id: number) {
        const formData = new FormData();
        formData.append("scp_id", scp_id.toString());

        const response = await fetch("/api/scp", {
            method: "DELETE",
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            location.reload();
        }
    }

    // Page
    return (
        <section className="container">
            <div className={styles.main}>
                <h1 className={styles.main__title}>List of all SCPs</h1>

                <div className={styles.filterSort}>
                    <label htmlFor="filter">
                        <strong>Filter by Class: </strong>
                        <select
                            className={styles.filterSort__filter}
                            onChange={handleFilterChange}
                        >
                            <option value=""></option>
                            <option value="Safe">Safe</option>
                            <option value="Euclid">Euclid</option>
                            <option value="Keter">Keter</option>
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
                                <option value="class">Class</option>
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
                        .filter((scp) =>
                            filter ? scp.getObjectClass() === filter : true,
                        )
                        .toSorted((a, b) => {
                            switch (sortBy) {
                                case "id":
                                    return sortOrder === "asc"
                                        ? a.getId() - b.getId()
                                        : b.getId() - a.getId();
                                case "class":
                                    return sortOrder === "asc"
                                        ? (
                                              a.getObjectClass() || ""
                                          ).localeCompare(
                                              b.getObjectClass() || "",
                                          )
                                        : (
                                              b.getObjectClass() || ""
                                          ).localeCompare(
                                              a.getObjectClass() || "",
                                          );
                                case "name":
                                    return sortOrder === "asc"
                                        ? (a.getName() || "").localeCompare(
                                              b.getName() || "",
                                          )
                                        : (b.getName() || "").localeCompare(
                                              a.getName() || "",
                                          );
                                case "facility_id":
                                    return sortOrder === "asc"
                                        ? a.getFacilityId() - b.getFacilityId()
                                        : b.getFacilityId() - a.getFacilityId();
                                default:
                                    return 0;
                            }
                        })
                        .map((scp) => (
                            <div
                                className={styles.card__wrapper}
                                key={scp.getId()}
                            >
                                {updateHidden == scp.getId() ? (
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
                                            <label htmlFor="scp_id">
                                                <strong>Item#: </strong>SCP-
                                                {scp.formatedId()}
                                                <input
                                                    type="hidden"
                                                    name="scp_id"
                                                    id="scp_id"
                                                    value={`SCP-${scp.formatedId()}`}
                                                />
                                            </label>

                                            <label htmlFor="name">
                                                <strong>Name: </strong>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    defaultValue={
                                                        scp.getName() ??
                                                        undefined
                                                    }
                                                />
                                            </label>

                                            <label htmlFor="object_class">
                                                <strong>Class: </strong>
                                                <select
                                                    name="object_class"
                                                    id="object_class"
                                                    defaultValue={
                                                        scp.getObjectClass() ??
                                                        undefined
                                                    }
                                                >
                                                    <option value=""></option>
                                                    <option value="Safe">
                                                        Safe
                                                    </option>
                                                    <option value="Euclid">
                                                        Euclid
                                                    </option>
                                                    <option value="Keter">
                                                        Keter
                                                    </option>
                                                </select>
                                            </label>

                                            <label htmlFor="containment">
                                                <strong>
                                                    Containment Procedures:{" "}
                                                </strong>
                                            </label>
                                            <textarea
                                                name="containment"
                                                id="containment"
                                                defaultValue={
                                                    scp.getContainment() ??
                                                    undefined
                                                }
                                            />

                                            <label htmlFor="description">
                                                <strong>Description: </strong>
                                            </label>
                                            <textarea
                                                name="description"
                                                id="description"
                                                defaultValue={
                                                    scp.getDescription() ??
                                                    undefined
                                                }
                                            />

                                            <label htmlFor="photo">
                                                <strong>
                                                    SCP Photo (URL):{" "}
                                                </strong>
                                            </label>
                                            <input
                                                type="text"
                                                name="photo"
                                                id="photo"
                                                defaultValue={
                                                    scp.getPhoto() ?? undefined
                                                }
                                                placeholder="https://example.com/image.png"
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
                                                    defaultValue={scp.getFacilityId()}
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
                                                        : "Edit SCP"
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
                                                            scp.getId(),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                title={
                                                    !loggedIn
                                                        ? "Log in to delete"
                                                        : "Delete SCP"
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
                                                            scp.getId(),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Link
                                            className={styles.card__bottom}
                                            href={`/scp-${scp.formatedId()}`}
                                        >
                                            <div
                                                className={
                                                    styles.card__bottomTexts
                                                }
                                            >
                                                <h2
                                                    className={
                                                        styles.card__bottomId
                                                    }
                                                >
                                                    <strong>Item#: </strong>SCP-
                                                    {scp.formatedId()}
                                                </h2>
                                                <p
                                                    className={
                                                        styles.card__bottomName
                                                    }
                                                >
                                                    <strong>Name: </strong>
                                                    {scp.getName()}
                                                </p>
                                                <p
                                                    className={
                                                        styles.card__bottomClass
                                                    }
                                                >
                                                    <strong>Class: </strong>
                                                    {scp.getObjectClass()}
                                                </p>
                                            </div>
                                            <img
                                                className={
                                                    styles.card__bottomImage
                                                }
                                                src={
                                                    scp.getPhoto() ??
                                                    "/img/no-image.png"
                                                }
                                                alt={
                                                    "SCP-" +
                                                    scp.formatedId() +
                                                    " photo"
                                                }
                                            />
                                        </Link>
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
                                        className={styles.form__requried}
                                        htmlFor="scp_id"
                                    >
                                        <strong>Item#: </strong>
                                        <input
                                            type="text"
                                            name="scp_id"
                                            id="scp_id"
                                            placeholder="SCP-001"
                                            required
                                        />
                                    </label>

                                    <label htmlFor="name">
                                        <strong>Name: </strong>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                        />
                                    </label>

                                    <label htmlFor="object_class">
                                        <strong>Class: </strong>
                                        <select
                                            name="object_class"
                                            id="object_class"
                                        >
                                            <option value=""></option>
                                            <option value="Safe">Safe</option>
                                            <option value="Euclid">
                                                Euclid
                                            </option>
                                            <option value="Keter">Keter</option>
                                        </select>
                                    </label>

                                    <label htmlFor="containment">
                                        <strong>
                                            Containment Procedures:{" "}
                                        </strong>
                                    </label>
                                    <textarea
                                        name="containment"
                                        id="containment"
                                    />

                                    <label htmlFor="description">
                                        <strong>Description: </strong>
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                    />

                                    <label htmlFor="photo">
                                        <strong>SCP Photo: </strong>
                                    </label>
                                    <input
                                        type="text"
                                        name="photo"
                                        id="photo"
                                        placeholder="https://example.com/image.png"
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
