import { useState } from "react"
import { CiBoxList } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import { FaBox } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";


export const Menu = () => {
    const [open, setOpen] = useState(false)
    const hidenMenu = () => {
        if (open === false) {
            setOpen(true)
        }
        else {
            setOpen(false)
        }
    }

    const menuItems = [
        {
            icons: <FaHome size={26.5}/>,
            label: "Home"
        },
        {
            icons: <FaBox size={20} />,
            label: "Registro paquete"
        },
        {
            icons: <FaUserCircle/>,
            label: "Usuarios"
        },
        {
            icons: <BiSolidReport size={23.9}/>,
            label: "Reporte"
        },
        {
            icons: <TbTruckDelivery size={23.5}/>,
            label: "Provedores"
        },
 
        {
            icons: <CiLogout size={26.5}/>,
            label: "Cerrar Sesion"
        },
    ]
    return (
        <div>
            <nav className={`shadow-md h-screen bg-blue-700 text-white transition-all duration-300  ${open ? "w-64" : "w-10"}`}>
                <button className="w-64" onClick={hidenMenu}><CiBoxList size={30} className="cursor-pointer m-1" /> </button>
                <div className><img src="/logomediano.png" className={`${open ? 'w-30' : 'w-0'}`} /></div>


                <ul className="flex-1">
                    {
                        menuItems.map((item, index) => {
                            return (<li key={index} className="my-2 px3 py-2 hover:bg-blue-100 rounded-md duration-300 cursor-pointer flex gap-2 items-center group">
                                <p className="ml-2">{item.icons}</p>
                                <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden `}>{item.label}</p>
                                <p className={`${open && "hidden"} absolute left-32 shadow-md rounded-md 
                                w-0 
                                p-0 
                                duration-500
                                overflow-hidden
                                group-hover:w-fit
                                group_hover:p-2
                                group-hover:left-16
                                `}>{item.label}</p>
                            </li>)
                        })
                    }
                </ul>

      {/*           <div className="flex items-center gap-2 px-3 py-2 ">
                    <FaUserCircle size={30}/>
                    <div>
                        <p></p>
                    </div>
                    
                </div> */}
            </nav>

        </div>

    )
}
