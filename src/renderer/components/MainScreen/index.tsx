import React, { DragEvent, useEffect, useState } from "react";
import { Minus } from "../Icons/Minus";
import { X } from "../Icons/X";
import "./style.css";
import { NeutralEmoji } from "../Icons/Emojis/NeutralEmoji";
import axios from "axios";
import { HappyEmoji } from "../Icons/Emojis/HappyEmoji";
import { SurpriseEmoji } from "../Icons/Emojis/SurpriseEmoji";
import { AngerEmoji } from "../Icons/Emojis/AngerEmoji";
import { SadEmoji } from "../Icons/Emojis/SadEmoji";
import { DisgustEmoji } from "../Icons/Emojis/DisgustEmoji";
import { ContemptEmoji } from "../Icons/Emojis/ContemptEmoji";
import { FearEmoji } from "../Icons/Emojis/FearEmoji";
import { UndefinedEmoji } from "../Icons/Emojis/UndefinedEmoji";
import LOGO_PATH from "../../assets/icon.png"

const EMOJIS = {
    "Undefined": <UndefinedEmoji className="emoji" />,
    "Happy": <HappyEmoji className="emoji" />,
    "Neutral": <NeutralEmoji className="emoji" />,
    "Fear": <FearEmoji className="emoji" />,
    "Contempt": <ContemptEmoji className="emoji" />,
    "Disgust": <DisgustEmoji className="emoji" />,
    "Sad": <SadEmoji className="emoji" />,
    "Anger": <AngerEmoji className="emoji" />,
    "Surprise": <SurpriseEmoji className="emoji" />,
}

export const EmotionRecognizer = (): JSX.Element => {
    const [image, setImage] = useState<string | null>(null);
    const [emotion, setEmotion] = useState('Undefined')
  
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
      };
  
    useEffect(() => {
      const uploadImage = async () => {
        if (!image) return;
  
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('image', blob, 'image.jpg');
  
          const uploadResponse = await axios.post('http://127.0.0.1:8000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          const newEmotion = String(uploadResponse.data.data)
          
          setEmotion(newEmotion.charAt(0).toUpperCase() + newEmotion.slice(1).toLowerCase());
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      };
  
      uploadImage();
    }, [image]);
  
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleClose = () => {
        window.electron.ipcRenderer.sendMessage("ipc-close");
    };

    const handleMinimize = () => {
        window.electron.ipcRenderer.sendMessage("ipc-minimize");
    };

    return (
        <div className="emotion-recognizer">
            <div className="div">
                <div className="overlap">
                    <div 
                        className="image-frame"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none', position: 'absolute', top: 180, left: 100, zIndex: 5 }}
                            onChange={handleFileChange}
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="drag-and-drop-or"
                        >
                            {!image && <>Drag and Drop or <br />
                            click to browse photo</>}
                        </label>
                        {image && (
                            <img
                            src={image}
                            alt="Preview"
                            onClick={() => { setImage(null); setEmotion('Undefined')}}
                            style={{
                                position: 'absolute',
                                bottom: 60,
                                borderRadius: 40,
                                left: 0,
                                width: 400,
                                height: 400,
                            }}
                            />
                        )}
                        <div className="rectangle" />
                        <div className="text-wrapper">{emotion}</div>
                    </div>
                    {EMOJIS[emotion]}
                <div className="overlap-group">
                    <div className="navbar">
                        <img src={LOGO_PATH} className="logo" />
                        <div className="drag-area" />
                        <div onClick={handleMinimize}><Minus className="icon-solid-minus" /></div>
                        <div onClick={handleClose}><X className="icon-solid-x" color="#A4F6CC" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
