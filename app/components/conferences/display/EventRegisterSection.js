import { useEffect, useRef, useState } from "react"
import { Badge, Button, Card, Container, Nav, Navbar } from "react-bootstrap"
import styles from "../../../styles/event.module.css";


const detectElement = (options) => {
    const containerRef = useRef(null)
    const [ inView, setInView] = useState(false)

    const callbackFn = (entries) => {
        const [ entry ] = entries
        setInView(entry.isIntersecting)
    }

    useEffect(() => {
        let observer = new IntersectionObserver(callbackFn, options);
        if (containerRef.current) observer.observe(containerRef.current)

        return () => {
            if (containerRef.current) observer.unobserve(containerRef.current)
        }
    }, [containerRef, options])

    return [containerRef, inView]
}

export const EventTicket = ({tktDetail}) => {
    const [containerRef, inView] = detectElement({
        root: null,
        rootMargin: "0px 0px 100% 0px",
        threshold: 0.7
    })

    const tktName = tktDetail.attributes.name
    const tktPrice = tktDetail.attributes.price
    const handleRegister = () => {
        alert("Ah, it's coming!")
    }
    
    return (
        <>
        <InNav brand={tktName} price={tktPrice} handleRegister={handleRegister} containerRef={containerRef} />
        {!inView && <TopNav brand={tktName} price={tktPrice} handleRegister={handleRegister} />}
        </>
    )
}

const InNav = ({brand, price, handleRegister, containerRef}) => {
    return (
        <Navbar ref={containerRef} className={styles.event_ticket_nav} variant="dark">
        <Container>
          <Navbar.Brand>{brand} {" "} 
            <Badge as={"span"} pill bg="light" text="secondary">
                {price ? price : "Free"}
            </Badge>
          </Navbar.Brand>
          <Nav className="me-auto">
            
          </Nav>
          <Button onClick={handleRegister} >
            Register
          </Button>
        </Container>
      </Navbar>
    )
}

const TopNav = ({brand, price, handleRegister}) => {
    return (
        <Navbar fixed={"top"} className={styles.event_ticket_nav} variant="dark">
        <Container>
          <Navbar.Brand>{brand} {" "} 
            <Badge as={"span"} pill bg="light" text="secondary">
                {price ? price : "Free"}
            </Badge>
          </Navbar.Brand>
          <Nav className="me-auto">
            
          </Nav>
          <Button onClick={handleRegister}>
            Register
          </Button>
        </Container>
      </Navbar>
    )
}