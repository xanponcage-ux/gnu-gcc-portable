
interface C1FPS013Request {
    action: "View" | "Enter"
    coilId: string | number
    processLine: "CPL1" | "PLTCM"
    surface: "Bottom" | "Top" | "Attributes"
}
interface OtherUpdateInsert {
    COIL_ID: string | number
    RESULT: string
    P_NO: string
}
interface InsertDefects {
    COIL_ID: string | number
    DEFECT: string
    TYPE: string
    DEF_CD: string
    DEF_DESC: string
    LEN: string
    WID: string
    WID_WS: string
    SEVERE: string
    REMARKS: string
    SURF: string
    HOLD: string
    P_NO: string
}
interface UpdateDefects {
    DEFECT: string
    LEN: string
    WID: string
    WID_WS: string
    SEVERE: string
    REMARKS: string
    HOLD: string
    P_NO: string
    COIL_ID: string | number
    TYPE: string
    DEF_CD: string
}

interface UpdateAttributes {
    ACT: string
    RESULT: string
    REMARKS: string
    HOLD: string
    P_NO: string
    COIL_ID: string | number
    TYPE: string
    DEF_CD: string
}
