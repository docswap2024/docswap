import { Collapse } from 'rizzui';
import { PiCaretDownBold } from 'react-icons/pi';
import { cn } from '@/lib/utils/cn';
import {numberWithCommas, checkIfEmpty, formatDate, getBathrooms, getGarageSituation} from '@/lib/utils/format';

export const LastSold = ({ getProperty, propertyType }:{ getProperty: any, propertyType: string }) => {
    const propertyInfoArray: any[] = JSON.parse(getProperty.MLSData.Value);
    const isListing = propertyType.includes("Listing");
    const isLandListing = propertyType.includes("land");


    const data = [
        {name: "Year Built", value: isListing ? getProperty.YearBuilt.Value : getProperty.YearConstructed.Value},
        {name: 'Lot Size', value: `${numberWithCommas(getProperty.LotSize.Value)} sf`},
        {name: 'Floor Area', value: isListing ? `${numberWithCommas(getProperty.TotalFloorArea.Value)} sf` : `${numberWithCommas(getProperty.FloorArea.Value)} sf`},
        {name: 'Beds', value: getProperty.Bedrooms.Value},
        {name: 'Baths', value: (isListing && !isLandListing) ? getBathrooms(getProperty.FullBaths.Value, getProperty.HalfBaths.Value) : getProperty.Bathrooms.Value},
        {name: 'Garage', value: (isListing && !isLandListing) ? getGarageSituation(getProperty.Parking.Value) : (!isListing && !isLandListing) ? getProperty.Garage.Value : 'N/A'},
        {name: 'First Floor', value: `${numberWithCommas(getProperty.FirstFloor.Value)} sf`},
        {name: 'Second Floor', value: `${numberWithCommas(getProperty.SecondFloor.Value)} sf`},
        {name: 'Third Floor', value: `${numberWithCommas(getProperty.ThirdFloor.Value)} sf`},
    ]

    return (
        <Collapse
            className="last-of-type:border-t-0 border-b border-muted"
            defaultOpen={true}
            header={({ open, toggle }) => (
                <div
                role="button"
                onClick={toggle}
                className="flex w-full cursor-pointer items-center justify-between py-6 font-lexend text-lg font-semibold text-gray-900"
                >
                <span>
                    Last Sold: <span className="font-normal">{formatDate(getProperty.LastMLSDate.Value)}</span>
                </span>
                <div className="flex shrink-0 items-center justify-center">
                    <PiCaretDownBold
                    className={cn(
                        'h-[18px] w-[18px] transform transition-transform duration-300',
                        open && 'rotate-180'
                    )}
                    />
                </div>
                </div>
            )}
        >
            <div className="-mt-2 pb-7">
                {getProperty.MLSData.Value && (
                    <div className="w-full overflow-x-auto mt-3">
                    <table className="min-w-full text-center text-black">
                      <thead className="bg-steel-50/70 border">
                        <tr>
                          <th scope="col" className="px-4 py-2 md:px-6 md:py-3 border">Date</th>
                          <th scope="col" className="px-4 py-2 md:px-6 md:py-3 border">Type</th>
                          <th scope="col" className="px-4 py-2 md:px-6 md:py-3 border">Sold Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyInfoArray.map((propertyInfo, index) => (
                          <tr key={index} className='bg-white'>
                            <td className="px-2 py-2 md:px-6 md:py-4 border">{propertyInfo.Date}</td>
                            <td className="px-2 py-2 md:px-6 md:py-4 border">{propertyInfo.Type}</td>
                            <td className="px-2 py-2 md:px-6 md:py-4 border">{`$ ${checkIfEmpty(numberWithCommas(propertyInfo.Price))}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )} 

                <div className="grid md:grid-cols-3 grid-cols-2 p-4 pt-5">
                    {data.map((item, index) => (
                    <div className="min-w-0 flex-auto border-b p-2 md:p-3" key={index}>
                        <p className="font-semibold text-sm md:text-base leading-5 text-black uppercase">{item.name}</p>
                        <p className="mt-1 truncate text-xs md:text-sm leading-4 text-black">{checkIfEmpty(item.value)}</p>
                    </div>
                    ))}
                </div>
                <p className='p-4 text-xs'><span className='font-semibold'>Note: </span> data provided by BCA / LTSA public record</p>
            </div>
        </Collapse>
    );
}