import { GetServerSideProps } from "next";
import styles from "@/styles/SCP.module.scss";

import SCP from "@/entities/SCP";

type Props = {
    scp: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
    context,
) => {
    const id = context.params?.id as string;
    const scpID = parseInt(id.split("-")[1], 10);
    if (isNaN(scpID)) {
        return {
            props: {
                scp: null,
            },
        };
    }
    const scp = await SCP.getByID(scpID);

    return {
        props: {
            scp: scp ? scp.serialize() : null,
        },
    };
};

export default function Index({ scp }: Props) {
    if (!scp) {
        return <h1>SCP not found</h1>;
    }

    const lol = SCP.deserialize(scp);

    return (
        <section className="container">
            <div className={styles.main}>
                <h1 className={styles.main__title}>SCP-{lol.formatedId()}</h1>
                <div className={styles.main__wrapper}>
                    <div className={styles.main__texts}>
                        <h2 className={styles.main__name}>
                            <strong>Name:</strong> {lol.getName()}
                        </h2>
                        <p className={styles.main__class}>
                            <strong>Class: </strong>
                            {lol.getObjectClass()}
                        </p>
                        <p className={styles.main__containment}>
                            <strong>Containment: </strong>
                            {lol.getContainment()}
                        </p>
                        <p className={styles.main__description}>
                            <strong>Description: </strong>
                            {lol.getDescription()}
                        </p>
                        <p className={styles.main__facility}>
                            <strong>Facility: </strong>
                            {`SITE-${lol.getFacilityId().toString().padStart(2, "0")}`}
                        </p>
                    </div>
                    <img
                        className={styles.main__image}
                        src={lol.getPhoto() ?? undefined}
                        alt={lol.getName() ?? undefined}
                    />
                </div>
            </div>
        </section>
    );
}
