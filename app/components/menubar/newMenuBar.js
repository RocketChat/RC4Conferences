import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { forwardRef, Fragment, useEffect, useRef, useState } from 'react';
import {
  Col,
  Container,
  Dropdown,
  Nav,
  Navbar,
  Offcanvas,
  Row,
} from 'react-bootstrap';
import styles from '../../styles/Menubar.module.css';
import { DummyLoginButton } from '../auth/dummy';
import OauthComponent from '../auth/oauth/ui';
import BrandLogo from '../brandlogo';
import RocketChatLinkButton from '../rocketchatlinkbutton';

const userCookie = Cookies.get('user');
const hasAllRequiredCreds =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && process.env.NEXT_PUBLIC_RC_URL;

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <a
    className={styles.elipses}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <span className={styles.threedots} />
  </a>
));

if (!hasAllRequiredCreds)
  console.log(
    'RC4Community is now using a dummy Auth Component! If you wish to use a robust Auth component, provide all the credentials first (https://github.com/RocketChat/RC4Community/tree/master/app/components/auth)'
  );

const ArrowIcon = () => {
  return (
    <svg
      width="14"
      height="15"
      viewBox="0 0 32 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.5 1.5L15.5 15.5L31 1.5" stroke="black" strokeWidth="2" />
    </svg>
  );
};

const MobileNav = ({ nav_Items }) => {
  const [dropDown, setDropDown] = useState({ show: false, _id: 0 });
  return (
    <Navbar className="d-lg-none" expand={false}>
      <Container fluid>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          className={styles.default_toggler}
        >
          <div
            className={`${styles.navbar_toggler} navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around bg-white`}
            type="button"
          >
            <span className={`${styles.toggler_icon} mb-2`}></span>
            <span className={`${styles.toggler_icon} mt-2`}></span>
          </div>
        </Navbar.Toggle>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Navbar.Brand
              href="/"
              className="d-flex justify-content-center align-items-center "
            >
              <BrandLogo
                logoLink={
                  'https://global-uploads.webflow.com/611a19b9853b7414a0f6b3f6/611bbb87319adfd903b90f24_logoRC.svg'
                }
                imageTitle={'Rocket.Chat'}
                brandName={'Rocket.Chat Community'}
                height={30}
                width={132}
              />
            </Navbar.Brand>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {nav_Items?.map((nav_Item, key) =>
              nav_Item.url ? (
                <div key={key}>
                  <Row
                    className={`${styles.dropdown} d-flex flex-row justify-content-between align-items-center mt-3 `}
                    onClick={() => {
                      setDropDown({ show: false, _id: 0 });
                    }}
                  >
                    <Col>
                    <Link 
                        key={nav_Item.id}
                        href={nav_Item.url}
                      >
                      <a className='text-decoration-none fs-4 fw-light text-dark' >
                        {nav_Item.label}
                      </a>
                      </Link>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div key={key}>
                  <Row
                    className={`${styles.dropdown} d-flex flex-row justify-content-between align-items-center mt-3 `}
                    onClick={() => {
                      if (dropDown._id === nav_Item.id) {
                        setDropDown({ show: false, _id: 0 });
                      } else {
                        setDropDown({ show: true, _id: nav_Item.id });
                      }
                    }}
                  >
                    <Col
                      className={
                        dropDown._id === nav_Item.id && dropDown.show
                          ? `${styles.color} fs-4 fw-light`
                          : 'fs-4 fw-light'
                      }
                    >
                      {nav_Item.label}
                    </Col>
                    <Col>
                      {nav_Item.sub_menus?.data?.length > 1 && (
                        <span
                          className={
                            dropDown.show
                              ? `${styles.arrowRotate} bg-transparent me-2`
                              : `${styles.arrow} bg-transparent me-2 `
                          }
                        >
                          <ArrowIcon />
                        </span>
                      )}
                    </Col>
                  </Row>
                  {dropDown._id === nav_Item.id && dropDown.show ? (
                    <div>

                      {nav_Item.sub_menus.data.map(
                        (item, key) =>
                        (
                          <Fragment key={key}>
                            <div key={key} className={'p-2 fw-medium' + ` ${item.attributes.style === 'disable' ? styles.link_heading_mobile : 'fw-light link-primary'}`}>
                              <Link
                                href={item.attributes.url ? item.attributes.url : '#'}
                              >
                                <a   className={styles.subItemLinks} >{item.attributes.label}</a>
                              </Link>
                            </div>
                            {nav_Item.attributes?.parent_id && nav_Item.sub_menus.data.map(
                              (subItem, key) =>
                                subItem.attributes.parent_id === item.attributes.id && (
                                  <div className='px-4 py-1 fw-light'>
                                    <Link 
                                      key={key}
                                      href={subItem.attributes.url ? subItem.attributes.url : '#' }>
                                    <a
                                      className={styles.subItemLinks}
                                    >
                                      {subItem.attributes.label}
                                    </a>
                                    </Link>
                                  </div>
                                )
                            )}
                        </Fragment>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              )
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <SidebarItem />
      </Container>
    </Navbar>
  );
};

const DesktopNav = ({ nav_Items }) => {
  const [isShown, setIsShown] = useState(0);
  const clickRef = useRef(null);

  const handleClickOutside = (event) => {
    if (clickRef.current && !clickRef.current.contains(event.target)) {
      setIsShown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Navbar className="d-none d-lg-flex justify-content-between px-4 py-3">
      <Nav className="w-full " ref={clickRef}>
        <BrandLogo
          logoLink={
            'https://global-uploads.webflow.com/611a19b9853b7414a0f6b3f6/611bbb87319adfd903b90f24_logoRC.svg'
          }
          imageTitle={'Rocket.Chat'}
          brandName={'Rocket.Chat Community'}
          height={21}
          width={124}
        />
        {nav_Items?.map((nav_item, key) =>
          nav_item.sub_menus?.data?.length > 1 ? (
            <span
              key={key}
              className="p-2 d-flex flex-column mx-3 "
              onMouseEnter={() => {
                setIsShown(nav_item.id);
              }}
              onTouchStart={() => {
                setIsShown(nav_item.id);
              }}
              onMouseLeave={() => setIsShown(0)}
            >
              <span className={`${styles.navbar_item_hover} text-muted`}>
                {nav_item.url ? (
                  <Link href={ nav_item ? this.nav-item.url : '#' } className='text-decoration-none'>
                    {nav_item.label}
                  </Link>
                ) : (
                  nav_item.label
                )}
              </span>
              {/*submenu container | this will be shown for those whose id is in isShown */}
              <div className={`${styles.navbar_subitems} shadow-lg`}>
                {isShown === nav_item.id && (
                  <div
                    className={
                      nav_item.sub_menus.data?.length > 10
                        ? 'd-flex flex-row '
                        : 'd-flex flex-column '
                    }
                  >
                    {/* iterate over sub menus like omnichannels, devops, GSoC, GSoD */}

                    {nav_item.sub_menus.data.map(
                      (item, key) =>
                      (
                        <div className={`${styles.navbar_subitems_items} `} key={key}>
                          <div className={item.attributes.style === 'disable' ? styles.link_heading : ''}>
                            <Link
                              href={item.attributes.url ? item.attributes.url : '#' }
                           
                            >
                              <a className={styles.subItemLinks} >{item.attributes.label} </a>
                            </Link>
                          </div>
                          {/*if submenus contain more sub menus */}
                          {item.sub_menus?.data.map(
                            (subItem) =>
                              subItem.attributes.parent_id === item.attributes.id && (
                                <div className='px-4 pt-3 fw-light'>
                                  <Link
                                    href={subItem.attributes.url ? subItem.attributes.url : '#'}
                                    className={styles.subItemLinks}
                                  >
                                    {subItem.attributes.label}
                                  </Link>
                                </div>
                              )
                          )}
                        </div>
                        {/*if submenus contain more sub menus */}
                        {item.sub_menus?.data.map(
                          (subItem) =>
                            subItem.attributes.parent_id ===
                              item.attributes.id && (
                              <div className="px-4 pt-3 fw-light">
                                <a
                                  href={subItem.attributes.url}
                                  className={styles.subItemLinks}
                                >
                                  {subItem.attributes.label}
                                </a>
                              </div>
                            )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </span>
          ) : (
            <Nav.Link
              key={key}
              className={`${styles.navbar_item_hover} text-muted mx-3`}
            >
              {nav_item.label}
            </Nav.Link>
          )
        )}
      </Nav>

      <SidebarItem />
    </Navbar>
  );
};

const SidebarItem = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    Cookies.get('hashmail')
      ? setIsUserLoggedIn(true)
      : setIsUserLoggedIn(false);
  }, []);

  return (
    <div className="d-inline-flex">
      <>
        {isUserLoggedIn && (
          <RocketChatLinkButton
            className={`bg-danger bg-gradient p-2 text-white ${styles.chat}`}
          >
            Click to Chat
          </RocketChatLinkButton>
        )}
        {userCookie && (
          <div className="mx-3">
            <Dropdown align="end" className={styles.dropdown_menu}>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu size="sm" title="">
                <Dropdown.Header>RC4Community Profile</Dropdown.Header>
                <Dropdown.Item>
                  <Link href={`/profile/${userCookie}`}>
                    <a className={styles.dropdown_menu_item}>Profile</a>
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </>

      <div className="mx-2">
        {hasAllRequiredCreds ? (
          // <RCGoogleLoginButton />
          <OauthComponent user={session?.user} />
        ) : (
          // <></>
          <DummyLoginButton />
        )}
      </div>
    </div>
  );
};

export default function NewMenubar(props) {
  return (
    <Container fluid>
      <MobileNav nav_Items={props.menu?.data?.attributes?.body} />
      <DesktopNav nav_Items={props.menu?.data?.attributes?.body} />
    </Container>
  );
}
