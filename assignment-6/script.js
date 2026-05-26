
    const header = document.querySelector("header");
    const section1 = document.querySelector(".section1");

    window.addEventListener("scroll", () => {

        const sectionTop = section1.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if(sectionTop <= screenHeight * 0.5){
            header.classList.add("shrink");
        }else{
            header.classList.remove("shrink");
        }

    });