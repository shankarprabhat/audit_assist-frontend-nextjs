import Image from 'next/image';

    function Logo() {
      return (
        <Image
          src="/images/Clintask Logo 2C.png"
          alt="Clintask Logo"
          width={150}
          height={50}
          sizes="(max-width: 768px) 100px, 150px" // Example sizes
        />
      );
    }

    export default Logo;