import type { NextRequest } from 'next/server';


export default interface Context {
    req: NextRequest;
    user?: any;
}