import { Collapse } from 'rizzui';
import { PiCaretDownBold } from 'react-icons/pi';
import { cn } from '@/lib/utils/cn';
import { numberWithCommas, checkIfEmpty } from '@/lib/utils/format';

export const BCAssessment = ({ getProperty, propertyType }:{ getProperty: any, propertyType: string }) => {
    const isListing = propertyType.includes("Listing");
    const data = [
        {name: 'Lot Size', value: `${numberWithCommas(getProperty.LotSize.Value)} sf`} ,
        {name: 'Floor Area', value: isListing ? `${numberWithCommas(getProperty.TotalFloorArea.Value)} sf` : `${numberWithCommas(getProperty.FloorArea.Value)} sf`},
        {name: 'Classification', value: getProperty.BCAssessmentDesc.Value},
    ];
    const bcAssessmentDataArray: any[] = JSON.parse(getProperty.BCAssessmentData.Value);
    return (
        <Collapse
            className="last-of-type:border-t-0 border-b border-muted "
            defaultOpen={true}
            header={({ open, toggle }) => (
                <div
                role="button"
                onClick={toggle}
                className="flex w-full cursor-pointer items-center justify-between py-6 font-lexend text-lg font-semibold text-gray-900"
                >
                BC Assessment
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
                <div className="grid grid-cols-2 md:grid-cols-3 p-4 pt-5">
                    {data.map((item, index) => (
                    <div className="min-w-0 flex-auto border-b p-3" key={index}>
                        <p className="font-semibold leading-6 text-black uppercase">{item.name}</p>
                        <p className="mt-1 truncate leading-5 text-black">{checkIfEmpty(item.value)}</p>
                    </div>
                    ))}
                </div>

                <div>
                {getProperty.BCAssessmentData.Value && (
                    <table className="min-w-full text-center text-black">
                      <thead className="bg-steel-50/70 border">
                        <tr>
                        <th scope='col' className='px-4 py-2 md:px-6 md:py-3 border'>July 1</th>
                        <th scope='col' className='px-4 py-2 md:px-6 md:py-3 border'>Land Value</th>
                        <th scope='col' className='px-4 py-2 md:px-6 md:py-3 border'>Building Value</th>
                        <th scope='col' className='px-4 py-2 md:px-6 md:py-3 border'>Total Value</th>
                        </tr>
                        </thead>
                        <tbody>
                            {bcAssessmentDataArray
                            .sort((a, b) => b.year - a.year)
                            .map((bcAssessmentInfo, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-grayLight'}`}>
                                <td className='px-2 py-2 md:px-6 md:py-4 border'>{checkIfEmpty(bcAssessmentInfo.year)}</td>
                                <td className='px-2 py-2 md:px-6 md:py-4 border'>$ {checkIfEmpty(numberWithCommas(bcAssessmentInfo.land_val))}</td>
                                <td className='px-2 py-2 md:px-6 md:py-4 border'>$ {checkIfEmpty(numberWithCommas(bcAssessmentInfo.improv_val))}</td>
                                <td className='px-2 py-2 md:px-6 md:py-4 border'>$ {checkIfEmpty(numberWithCommas(bcAssessmentInfo.total_val))}</td>
                            </tr>
                            ))}
                        </tbody>
                </table>
                )} 
                </div>
                <p className='p-4 text-xs'><span className='font-semibold'>Note: </span> data provided by BCA / LTSA public record</p>
            </div>
        </Collapse>
    )


}