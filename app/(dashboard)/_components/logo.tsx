import Image from "next/image";

export const Logo = () => {
    return ( <div>
        <Image
        height={90}
        width={90}
        alt="logo"
        src="/logo.svg"
        />
    </div> );
}
 
export default Logo;