import { Button, Card, CardBody, CardImg, CardImgOverlay, CardText, CardTitle, Col } from "reactstrap"
import RupiahFormater from "utils/RupiahFormater"

const PackageCard = ({paket, isAddedToCart, onAddCart}) => {
    return (
        <Col md="3 mt-2" >
            <Card className={`shadow ${isAddedToCart ? "border border-primary border-5" : ""}`}>
                <CardImg src={paket.gambar || "https://harmonylaundrys.com/img/logo-harmony.png"} alt={paket.nama} /> {/* Pastikan ini self-closing */}
                {isAddedToCart && (
                    <CardImgOverlay className="py-2">
                        <CardText tag={"h2"}>
                            <i className="fa-solid fa-circle-check"></i>
                        </CardText>
                    </CardImgOverlay>
                )}
                <CardBody className="p-0">
                    <CardTitle className="pt-0 pb-2 px-2 m-0 justify-content-center d-flex flex-column">
                        <strong>{paket.nama}</strong>
                        <span>{paket.keterangan}</span>
                        <span>
                            <RupiahFormater value={paket.harga}/>
                        </span>
                    </CardTitle>
                </CardBody>
                <Button onClick={()=>onAddCart(paket.id)}>Tambah</Button>
            </Card>
        </Col>
    )
}

export default PackageCard