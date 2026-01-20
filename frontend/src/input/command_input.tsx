import { useState, useEffect } from "react";
import { CommandResponse, MainCommandResponse } from "../data/response"
import "./command_input.css"
import {createCommand, getMainCommands} from "./input_api"

interface CommandInputProp {
  setCommands: React.Dispatch<React.SetStateAction<CommandResponse[]>>
}

const CommandInput = ({ setCommands }: CommandInputProp) => {
  const [selectedCommand, setSelectedCommand] = useState<MainCommandResponse | null>(null);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  // TODO: (Member) Setup anymore states if necessary
  const [commands, setMainCommands] = useState<MainCommandResponse[]>([]);

  // TODO: (Member) Fetch MainCommands in a useEffect
  useEffect(()=>{
    const fetchCommands = async() =>{
      try{
        const response = await getMainCommands();
        setMainCommands(response.data);
      }catch(err){
        console.error(`Failed to fetch commands:`, err);
      }
    };
    fetchCommands();
  },[]);

  

  const handleParameterChange = (param: string, value: string): void => {
    setParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // TODO:(Member) Submit to your post endpoint 
    e.preventDefault();
    if (!selectedCommand){
      return;
    }

    try{
      const command= {
        command_type:selectedCommand.id,
        params:JSON.stringify(parameters) || null
      };

      const response = await createCommand(command);
      setCommands(prev => [...prev, response.data]);
      setSelectedCommand(null);
      setParameters({});

    }catch(error){
      console.error("Failed to submit command:", error)
    }
  }

  return (
    
      <form onSubmit={handleSubmit}>
        <div className="spreader">
          <div>
            <label>Command Type: </label>
            {/* TODO: (Member) Display the list of commands based on the get commands request.
            It should update the `selectedCommand` field when selecting one.*/}

            <select
              value={selectedCommand?.id || ""}
              onChange={(e) => {
                const commandId = Number(e.target.value);
                const foundCommand = commands.find(c=>c.id===commandId);
                setSelectedCommand(foundCommand || null);
                setParameters({});
              }}
            >

              <option value="" disabled>Select a command</option>

              {commands.map(command => (
                <option key={command.id} value={command.id}>
                  {command.name}
                      </option>
              ))}

            </select>
          </div>
          {selectedCommand?.params?.split(",").map((param) => (
            <div key={param}>
              <label htmlFor={`param-${param}`}>{param}: </label>
              <input
                id={`param-${param}`}
                type="text"
                value={parameters[param] || ""}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
          <button type="submit">Submit</button>
        </div>
      </form>
    
  )
}

export default CommandInput;
