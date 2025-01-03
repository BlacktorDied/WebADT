import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import styles from "@/styles/Home.module.scss";
import SCP from "@/entities/SCP";

// Props Type
type Props = {
    scps: string[];
};

// Fetch all SCPs on the server side
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const scps = await SCP.getAll();

    return {
        props: {
            scps: scps.map((scp) => scp.serialize()),
        },
    };
};

export default function Home({ scps }: Props) {
    const list = scps.map(SCP.deserialize);
    const [randomScp, setRandomScp] = useState<SCP | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let randomIndex;
            
            do {
                randomIndex = Math.floor(Math.random() * list.length);
            } while (randomScp && list[randomIndex].formatedId() === randomScp.formatedId());

            setRandomScp(list[randomIndex]);
        }, 2500);

        return () => {
            clearInterval(interval);
        };
    }, [list, randomScp]);

    return (
        <div className="container">
            <div className={styles.main}>
                <div className={styles.main__texts}>
                    <h1 className={styles.main__title}>
                        Welcome to the SCP Foundation
                    </h1>
                    <p className={styles.main__text1}>
                        The SCP Foundation is a fictional organization
                        documented by the web-based collaborative-fiction
                        project of the same name. In universe, the SCP
                        Foundation is responsible for locating and containing
                        individuals, entities, locations, and objects that
                        violate natural law (referred to as SCPs). The
                        real-world website is community based and includes
                        elements of many genres such as horror, science fiction
                        and urban fantasy.
                    </p>
                    <p className={styles.main__text2}>
                        On this website you can find information about the SCPs,
                        the staff and the facilities of the SCP Foundation.
                        Authorized users can create, update and delete SCPs,
                        staff and facilities.
                    </p>
                </div>

                {randomScp && (
                    <div className={styles.scp}>
                        <h2 className={styles.scp__title}>
                            {randomScp.getName()} <br />
                            {`SCP-${randomScp.formatedId()}`}
                        </h2>
                        {randomScp.getPhoto() ? (
                            <img
                                className={styles.scp__photo}
                                src={
                                    randomScp.getPhoto() ?? "/img/no-image.png"
                                }
                                alt={"SCP-" + randomScp.formatedId() + " photo"}
                            />
                        ) : (
                            <p >No photo available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
