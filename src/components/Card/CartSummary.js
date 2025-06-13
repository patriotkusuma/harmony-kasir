import { Button, Card, CardBody, CardFooter, CardHeader, CardImg, CardTitle, Col, Input, Row } from "reactstrap"
import RupiahFormater from "utils/RupiahFormater"

const CartSummary = ({cartItems, subTotal, onUpdateCart, onRemoveCart, onClearCart}) => {

    return (
        <Card className="mb-2">
            <CardHeader className="pb-4">
                <CardTitle tag={'h2'} className="d-flex justify-content-between">
                    <span>Cart</span>
                    <Button color="danger" size="sm" onClick={onClearCart}>
                        X
                    </Button>  
                </CardTitle>
            </CardHeader>
            <CardBody className="overflow-auto" style={{maxHeight: '300px'}}>
                {cartItems && Object.keys(cartItems).length > 0 ? (
                    Object.keys(cartItems).map((key) => {
                        const item = cartItems[key]
                        return (
                            <Row className="bg-info mb-2 rounded align-items-center" key={key}>
                                <Col md="7">
                                    <div className="d-flex align-items-center">
                                        <CardImg className="rounded-lg p-2" style={{width: '80px'}} src={cartItems.attribute ? cartItems[key].attributes.image : 'https://harmonylaundrys.com/img/logo-harmony.png'}  alt={item.name}/>
                                        <h4 className="d-flex flex-column w-full text-dark">
                                            <span className="text-default">{cartItems[key].attributes.category_paket}</span>
                                            <span>{item.name}</span>
                                            <span className="font-weight-light">{`${item.quantity} Rp ${item.price}`}</span>
                                        </h4>
                                    </div>
                                </Col>
                                <Col md="5">
                                    <div className="d-flex align-items-center" style={{gap: '5%'}}>
                                        <Input 
                                            autoFocus={true}
                                            type="number"
                                            className="w-100"
                                            defaultValue={item.quantity}
                                            onChange={(e) => onUpdateCart(e.target.value, item.id)}
                                            min="1"
                                        />
                                        <Button color="danger" size="sm" type="button" onClick={()=>onRemoveCart(item)}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        ) 
                    }) 
                ) : (<p className="text-center text-muted" >Cart Is Empty</p>)
            }             
            </CardBody>
            <CardFooter className="py-2">
                <CardTitle tag={'h3'} className="d-flex justify-content-between">
                    <span>Sub Total</span>
                    <span><RupiahFormater value={subTotal}/></span>
                </CardTitle>
            </CardFooter>
        </Card>
    )
}

export default CartSummary