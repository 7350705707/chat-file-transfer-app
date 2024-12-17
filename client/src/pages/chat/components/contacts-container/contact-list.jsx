import { useAppStore } from "@/store";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";


const ContactList = ({contacts,ischannel=false}) => {

    const {selectedChatData,setSelectedChatData,setSelectedChatType,selectedChatType,setSelectedChatMessages,closeChat} = useAppStore();



    const handleClick = (contact) => {
            if(ischannel){
                setSelectedChatType('channel');
                setSelectedChatData(contact);

            }else{
                    setSelectedChatType('contact');
                    setSelectedChatData(contact);
                }

            if(selectedChatData && selectedChatData._id !== contact._id){
                setSelectedChatMessages([]);
            }

    }

    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div key={contact._id} onClick={() => handleClick(contact)} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ?"bg-[#8417ff] hover:bg-[#8417ff]":"hover:bg-[#f1f1f111]" }`}>
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !ischannel && (
                                        <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                                          {contact.image ? (
                                            <AvatarImage
                                              src={`${HOST}/${contact.image}`}
                                              className="object-cover w-full h-full bg-black"
                                            />
                                          ) : (
                                            <div
                                              className={`
                                                ${selectedChatData && selectedChatData._id === contact._id ?"bg-[#ffffff22] border border-white/70":getColor(
                                                contact.color)}
                                                uppercase h-10 w-10  text-4xl border-[1px] flex items-center justify-center rounded-full 
                                              )}`}
                                            >
                                              {contact.firstName
                                                ? contact.firstName.split("").shift()
                                                : contact.email.split("").shift()}
                                            </div>
                                          )}
                                        </Avatar>
                                      
                        )}
                        {
                            ischannel && (
                                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
                                    #
                                </div>
                            )
                        }
                        {
                            ischannel ? (  
                                    <span>{contact.name}</span>
                            ):( <span>{`${contact.firstName} ${contact.lastName}`}</span>)
                        }
                        
                    </div>
                    
                </div>
            ))}
        </div>
    );

};

export default ContactList;