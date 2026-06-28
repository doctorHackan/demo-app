import type { Response } from "express";

type TMeta = {
    page : number;
    limit : number;
    total : number;
}

type TResponseData<T> = {
    success : boolean;
    statusCode : number;
    message : string;
    data : T;
    meta ? : TMeta;
};

export const sendResponse = <T>(res : Response, content : TResponseData<T>) => {
    res.status(content.statusCode).json({
        success : content.success,
        statusCode : content.statusCode,
        message : content.message,
        data : content.data,
        meta : content.meta,
    });
}