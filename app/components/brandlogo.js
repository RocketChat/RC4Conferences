import Image from 'next/image'
import styles from "../styles/BrandLogo.module.css";

export default function BrandLogo(props) {
  return (
        <Image
          src={props.logoLink}
          title={props.imageTitle}
          alt={props.brandName}
          height={props.height}
          width={props.width}
        />
  );
}