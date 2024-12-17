import React, { useEffect } from 'react';
import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTE, GET_USER_CHANNELS_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactList from '@/pages/chat/components/contacts-container/contact-list';
import CreateChannel from './components/create-channel';
import NagaHillsLogo from '@/assets/3 Naga Hills.png';

const ContactsContainer = () => {

  const {setDirectMessagesContacts,directMessagesContacts, channels, setChannels} = useAppStore();

  useEffect(() => {

    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error(error);
      }
    }

  

    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 201 && response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getContacts();

    getChannels();

  },[setChannels,setDirectMessagesContacts]);


  






    return (
        <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
            <div className="pt-3">
                <Logo/>
            </div>
            <div className="my-5">
                    <div className="flex items-center justify-between  pr-10">
                            <Title text='Direct Messages'/>
                            <NewDm/>
                    </div>

                    <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
                       <ContactList contacts={directMessagesContacts} />
                    </div>
            </div>

            <div className="my-5">
                    <div className="flex items-center justify-between  pr-10">
                            <Title text='Channels'/>
                            <CreateChannel/>
                    </div>

                    <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
                       <ContactList contacts={channels} ischannel={true}/>
                    </div>
            </div>
            <ProfileInfo />
        </div>
    );
};

export default ContactsContainer;


const Logo = () => {
    return (
      <div className="flex p-5  justify-start items-center gap-2">
        <img src={NagaHillsLogo}
          alt="3 Naga Hills"
          className="h-20 w-20"/>
        <span className="text-3xl font-semibold ">Naga Hills</span>
      </div>
    );
  };


  const Title = ({text}) => {
    return (
        <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>{text}</h6>

    )};
  
