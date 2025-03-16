import Head from "next/head";
import { Stack, Nav, Card } from "react-bootstrap";
import { fetchAPI } from "../../../../lib/api";
import { EventDashBoard } from "../../../../components/conferences/admin/dashboard";
import { useRouter } from "next/router";

function EventDashBoardPage() {
    const router = useRouter();
    const { eid } = router.query;

    return (
        <div>
            <Head>
                <title>Event Create</title>
                <meta name="description" content="Rocket.Chat form tool demo" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="mx-auto">
                <h1 className="mx-auto mt-3">Preview of Event Dashboard</h1>
                <Card style={{ margin: "1vw" }}>
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey="published" activeKey={eid}>
                            <Nav.Item>
                                <Nav.Link href="published">Live</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="draft">Draft</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Stack direction="vertical">
                            <EventDashBoard state={eid} />
                        </Stack>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export async function getStaticPaths() {
    return {
        paths: [{ params: { eid: "published" } }, { params: { eid: "draft" } }],
        fallback: "blocking",
    };
}

export async function getStaticProps(context) {

    const topNavItems = await fetchAPI("/top-nav-item");

    return {
        props: { topNavItems },
        revalidate: 10,
    };
}

export default EventDashBoardPage;
