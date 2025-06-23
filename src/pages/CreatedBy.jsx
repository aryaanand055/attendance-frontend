import ProfileCard from '../components/ProfileCard'
import React, { useEffect } from 'react';

function CreatedByPage() {
    useEffect(() => {
        document.body.style.backgroundColor = 'black';
        return () => {
            document.body.style.backgroundColor = ''; // Reset to default
        };
    }, []);
    return (

        <div className='container d-flex gap-5'>

            <ProfileCard
                name="Abishek N"
                title="Backend Dev"
                handle="abi2506"
                status="Online"
                contactText="Contact Me"
                avatarUrl="/abi.png"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
            />
            <ProfileCard
                name="Arya A"
                title="UI/UX Designer"
                handle="MystiqueMaster"
                status="Online"
                contactText="Contact Me"
                avatarUrl="/arya.png"
                grainUrl=''
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => console.log('Contact clicked')}
            />
        </div>
    )
}

export default CreatedByPage;