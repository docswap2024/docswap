import { FaBed, FaBath, FaArrowsAlt, FaClock, FaDollarSign, FaLandmark, FaRegChartBar, FaChartLine, FaBriefcase, FaHome, FaCommentDollar } from 'react-icons/fa';
import { numberWithCommas, formatTax, checkIfEmpty} from '@/lib/utils/format';
import { Box } from '@/components/atoms/layout';

export const Details = ({ getProperty, propertyType }:{ getProperty: any, propertyType: string }) => {
    const yearConstructed = getProperty.YearConstructed.Value;
    const age = yearConstructed === '0' ? '-' : (new Date().getFullYear() - parseInt(yearConstructed)).toString();

    const propertyDetails = [
        {name: 'Bedrooms', value: getProperty.Bedrooms.Value, icon: FaBed},
        {name: 'Bathrooms', value: getProperty.Bathrooms.Value, icon: FaBath},
        {name: 'Floor Area', value: `${numberWithCommas(getProperty.FloorArea.Value)} sf`, icon: FaArrowsAlt},
        {name: 'Age', value: age, icon: FaClock},
        {name: 'Tax', value: `$ ${formatTax(getProperty.TaxPaid.Value)}`, icon: FaLandmark},
        {name: 'Tax Trend', value: getProperty.TaxTrend.Value, icon: FaDollarSign},
        {name: 'Assessment Trend', value: getProperty.BCAssessmentTrend.Value, icon: FaRegChartBar},
        {name: 'Property Size', value: `${numberWithCommas(getProperty.LotSize.Value)} sf`, icon: FaArrowsAlt},
    ]

    return (
        <Box className="grid grid-rows-2 md:grid-rows-2 grid-flow-col justify-around pt-4 gap-4 mb-5 border-2">
            {
                propertyDetails.map((detail, index) => (
                <div className="flex min-w-0 gap-x-2 md:gap-x-4 border-gray text-black" key={index}>
                    <detail.icon className='w-4 h-4 md:h-6 md:w-6 flex-none' />
                    <div className="min-w-0 flex-auto">
                        <p className="leading-tight uppercase">{detail.name}</p>
                        <p className="mt-1 truncate font-semibold leading-tight">{checkIfEmpty(detail.value)}</p>
                    </div>
                </div>
            ))}     
        </Box>
    )
}