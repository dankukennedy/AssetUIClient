
// Types for Asset Details
type DetailValue = 
   |string 
   | string[] 
   |Record<string, string>
   |Record<string, string[]>;

// Asset 
export interface IAssetUser{
    userId: string;
    category: string;
    type: string;
    subType: string;
    name: string;
    serialNo: string
    vendor: string;
    model: string;
    embossCode: string;
    details: Record<string, DetailValue>
}

