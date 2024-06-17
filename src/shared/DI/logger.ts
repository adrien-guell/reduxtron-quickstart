export const logger = {
    debug: (domain: string, message: unknown, subDomain?: string) => {
        console.log(`[${domain}${subDomain ? ` - ${subDomain}` : ''}]: `, message);
    }
};
