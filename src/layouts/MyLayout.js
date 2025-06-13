import AdminNavbar from 'components/Navbars/AdminNavbar copy';
import MySidebar from 'components/Sidebar/MySidebar'
import AdminFooter from 'components/Footers/AdminFooter'
import React from 'react'
import { Container } from 'reactstrap';

const MyLayout = (props) => {
    const mainContent = React.useRef(null);
    const {children, header} = props


  return (
    <>
        <MySidebar
            logo={{
                innerLink: "/admin/index",
                imgSrc: require("../assets/img/brand/harmony-blue.png"),
                imgAlt: "Harmony Laundry"
            }}
        />

        <div className='main-content' ref={mainContent}>
            <AdminNavbar
                brandText={header}
            />

            {children}
           <Container fluid>
                <AdminFooter/>
           </Container>
        </div>
    </>
  )
}

export default MyLayout