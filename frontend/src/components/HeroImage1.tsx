const HeroImage1 = () => {
    return ( 
<div className="relative bg-[url('/images/Hero_image.svg')] lg:h-91 h-25 bg-no-repeat bg-contain w-screen flex justify-center items-center">
    <div className="absolute inset-0 bg-black opacity-20 h-24 md:h-91">
    </div>
    <h3 className="text-white font-semibold text-sm lg:text-5xl w-1/2 text-center z-20">
    Lass Dich inspirieren, koche mit Leidenschaft und erlebe unvergessliche Momente bei Tisch.
        </h3>
</div>
     );
}
 
export default HeroImage1;