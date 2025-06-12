
import { CountClosed } from "./count-closed"
export interface CountOpen extends CountClosed {
    progress: number,
}
