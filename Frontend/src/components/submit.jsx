// submit.js
import { Rocket } from 'lucide-react';
import {Button} from './ui/button'

export const SubmitButton = () => {


    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', cursor:"pointer"}}>
            <Button variant="submit" size={'sm'}><Rocket />Submit</Button>
        </div>
    );
}
