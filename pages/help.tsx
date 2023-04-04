'use client';

import Image from "next/image";
// import elImage from './../public/eliza.jpg'

function Help() {
    return (<>
        <div className="p-10"> 
            {/* <Image src={elImage}  alt="Livepeer" height={300} width={300} className="mb-5 text-white bg-red-100" /> */}
            <a className=" help-link text-2xl py-2  font-bold text-white" href="https://docs.google.com/presentation/d/1PtXdg6Ug_vb3We_LgbcBwB1XHE4Vty5wjYnmhDEdB2U/edit?usp=sharing" target={"_blank"}>
                To see presentation how it works click this
            </a>
            <div className=" help-link text-2xl py-2  font-bold text-white"> If you have any questions or proposals you can find me</div>
            <div>
                <a className=" help-link text-2xl py-2  font-bold text-white" href="https://discord.com/channels/@me/Mbot#9569" target={"_blank"}>
                    in discord as Mbot#9569
                </a>
            </div>
            <div>
                <a className=" help-link text-2xl py-2  font-bold text-white" href="https://t.me/Spread2018" target={"_blank"}>
                    Telegram
                </a>
            </div>
            <div>
            <a className=" help-link text-2xl py-2  font-bold text-white" href="https://youtu.be/gFVrgK0WzEo" target={"_blank"}>
            How it works, you can to see on Youtube
                </a> 
            </div>

        </div>
    </>);
}

export default Help;