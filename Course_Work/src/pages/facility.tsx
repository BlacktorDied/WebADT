import styles from "@/styles/Facility.module.scss";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useLoggedIn } from "@/hooks";

import Edit from "@/icons/pencil.svg";
import Bin from "@/icons/bin.svg";
import Plus from "@/icons/plus.svg";
import Close from "@/icons/close.svg";

import Facility from "@/entities/Facility";

//Get all Facilities
type Props = {
    facilities: string[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const facilities = await Facility.getAll();

    return {
        props: {
            facilities: facilities.map((facility) => facility.serialize()),
        },
    };
};

export default function Facilities({ facilities }: Props) {
    const [addHidden, setAddHidden] = useState<boolean>(true);
    const [updateHidden, setUpdateHidden] = useState<number>();
    const [descHidden, setDescHidden] = useState<number>();
    const [filter, setFilter] = useState<string>("");
    const [sortBy, setSort] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    const list = facilities.map(Facility.deserialize);
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

    // Add new Facility
    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/facility", {
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
    // Update existing Facility
    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const response = await fetch("/api/facility", {
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
    // Delete Facility
    const handleDelete = async (facility_id: number) => {
        const formData = new FormData();
        formData.append("facility_id", facility_id.toString());

        const response = await fetch("/api/facility", {
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
                <h1 className={styles.main__title}>List of all Facilities</h1>

                <div className={styles.filterSort}>
                    <label htmlFor="filter">
                        <strong>Filter by Type: </strong>
                        <select
                            className={styles.filterSort__filter}
                            onChange={handleFilterChange}
                        >
                            <option value=""></option>
                            {list
                                .map((facility) => facility.getType() ?? "")
                                .map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
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
                                <option value="type">Type</option>
                                <option value="location">Location</option>
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
                        .filter((facility) =>
                            filter ? facility.getType() === filter : true,
                        )
                        .toSorted((a, b) => {
                            switch (sortBy) {
                                case "id":
                                    return sortOrder === "asc"
                                        ? a.getId() - b.getId()
                                        : b.getId() - a.getId();
                                case "type":
                                    return sortOrder === "asc"
                                        ? (a.getType() ?? "").localeCompare(
                                              b.getType() ?? "",
                                          )
                                        : (b.getType() ?? "").localeCompare(
                                              a.getType() ?? "",
                                          );
                                case "location":
                                    return sortOrder === "asc"
                                        ? (a.getLocation() ?? "").localeCompare(
                                              b.getLocation() ?? "",
                                          )
                                        : (b.getLocation() ?? "").localeCompare(
                                              a.getLocation() ?? "",
                                          );
                                default:
                                    return 0;
                            }
                        })
                        .map((facility) => (
                            <div key={facility.getId()}>
                                {updateHidden == facility.getId() ? (
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
                                            <label htmlFor="facility_id">
                                                <strong>Facility ID: </strong>{" "}
                                                SITE-
                                                {facility.formatedId()}
                                                <input
                                                    type="hidden"
                                                    name="facility_id"
                                                    id="facility_id"
                                                    value={`SITE-${facility.formatedId()}`}
                                                />
                                            </label>

                                            <label htmlFor="type">
                                                <strong>Type: </strong>
                                                <input
                                                    type="text"
                                                    name="type"
                                                    id="type"
                                                    defaultValue={
                                                        facility.getType() ??
                                                        undefined
                                                    }
                                                    placeholder="Type"
                                                />
                                            </label>

                                            <label htmlFor="location">
                                                <strong>Location: </strong>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    id="location"
                                                    defaultValue={
                                                        facility.getLocation() ??
                                                        undefined
                                                    }
                                                    placeholder="Location"
                                                />
                                            </label>

                                            <label htmlFor="description">
                                                <strong>Description: </strong>
                                                <textarea
                                                    name="description"
                                                    id="description"
                                                    defaultValue={
                                                        facility.getDescription() ??
                                                        undefined
                                                    }
                                                />
                                            </label>

                                            <label
                                                className={
                                                    styles.form__requried
                                                }
                                                htmlFor="logo"
                                            >
                                                <strong>Logo: </strong>
                                                <input
                                                    type="text"
                                                    name="logo"
                                                    id="logo"
                                                    defaultValue={facility.getLogo()}
                                                    placeholder="Logo URL"
                                                />
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
                                                        : "Edit Facility"
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
                                                            facility.getId(),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div
                                                title={
                                                    !loggedIn
                                                        ? "Log in to delete"
                                                        : "Delete Facility"
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
                                                            facility.getId(),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className={styles.card__bottom}
                                            onClick={() =>
                                                setDescHidden(facility.getId())
                                            }
                                        >
                                            <img
                                                className={
                                                    styles.card__bottomImage
                                                }
                                                src={facility.getLogo()}
                                                alt={`SITE-${facility.formatedId()} logo`}
                                            />
                                            <h2
                                                className={
                                                    styles.card__bottomId
                                                }
                                            >
                                                SITE-{facility.formatedId()}
                                            </h2>
                                        </div>
                                    </div>
                                )}
                                {descHidden == facility.getId() ? (
                                    <div className={styles.sidebar}>
                                        <Close
                                            className={styles.sidebar__close}
                                            onClick={() =>
                                                setDescHidden(undefined)
                                            }
                                        />
                                        <img
                                            className={styles.sidebar__image}
                                            src={facility.getLogo()}
                                            alt="Logo"
                                        />
                                        <h1 className={styles.sidebar__title}>
                                            {facility.getType() ?? undefined}{" "}
                                            SITE-
                                            {facility.formatedId()}
                                        </h1>
                                        <p>
                                            <strong>Location: </strong>
                                            {facility.getLocation() ??
                                                undefined}
                                        </p>
                                        <p>
                                            <strong>Description: </strong>
                                            {facility.getDescription() ??
                                                undefined}
                                        </p>
                                    </div>
                                ) : null}
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
                                        htmlFor="facility_id"
                                    >
                                        <strong>Facility ID: </strong>
                                        <input
                                            type="text"
                                            name="facility_id"
                                            id="facility_id"
                                            placeholder="SITE-01"
                                            required
                                        />
                                    </label>

                                    <label htmlFor="type">
                                        <strong>Type: </strong>
                                        <input
                                            type="text"
                                            name="type"
                                            id="type"
                                        />
                                    </label>

                                    <label htmlFor="location">
                                        <strong>Location: </strong>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                        />
                                    </label>

                                    <label htmlFor="description">
                                        <strong>Description: </strong>
                                        <textarea
                                            name="description"
                                            id="description"
                                        />
                                    </label>

                                    <label
                                        className={styles.form__requried}
                                        htmlFor="logo"
                                    >
                                        <strong>Logo: </strong>
                                        <input
                                            type="text"
                                            name="logo"
                                            id="logo"
                                            placeholder="https://logo.png"
                                            required
                                        />
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
