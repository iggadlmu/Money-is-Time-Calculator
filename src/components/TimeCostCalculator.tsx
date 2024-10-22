import React, { useState } from 'react';
import { DollarSign, Clock, ShoppingCart, Calculator, Hourglass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { InputField } from './InputField';

const TimeCostCalculator = () => {
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [dailyHours, setDailyHours] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setYearlyIncome(value);
  };

  const validateInputs = () => {
    const income = parseFloat(yearlyIncome);
    const hours = parseFloat(dailyHours);
    const price = parseFloat(itemPrice);

    if (!yearlyIncome) return "Please enter your yearly income";
    if (!dailyHours) return "Please enter your daily working hours";
    if (!itemPrice) return "Please enter the item price";
    
    if (isNaN(income) || income <= 0) return "Please enter a valid yearly income";
    if (isNaN(hours) || hours <= 0 || hours > 24) return "Please enter valid daily hours (between 0 and 24)";
    if (isNaN(price) || price <= 0) return "Please enter a valid price";

    return null;
  };

  const calculateWorkingHours = () => {
    setError(null);
    const validationError = validateInputs();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const yearlyIncomeNum = parseFloat(yearlyIncome);
    const dailyHoursNum = parseFloat(dailyHours);
    const price = parseFloat(itemPrice);
    const userAnnualHours = dailyHoursNum * 5 * 52;
    const hourlyEarnings = yearlyIncomeNum / userAnnualHours;

    if (isRecurring) {
      const monthlyWorkingHours = price / hourlyEarnings;
      const yearlyWorkingHours = monthlyWorkingHours * 12;
      
      setResult({
        isRecurring: true,
        monthlyHours: monthlyWorkingHours.toFixed(1),
        monthlyDays: (monthlyWorkingHours / dailyHoursNum).toFixed(1),
        yearlyHours: yearlyWorkingHours.toFixed(1),
        yearlyDays: (yearlyWorkingHours / dailyHoursNum).toFixed(1),
        hourlyRate: hourlyEarnings.toFixed(2)
      });
    } else {
      const workingHours = price / hourlyEarnings;
      
      setResult({
        isRecurring: false,
        hours: workingHours.toFixed(1),
        days: (workingHours / dailyHoursNum).toFixed(1),
        hourlyRate: hourlyEarnings.toFixed(2)
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Hourglass className="w-6 h-6 text-primary" />
          Time is Money Calculator
        </CardTitle>
        <CardDescription>
          Convert your purchases into working hours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputField
          id="yearly-income"
          label="Yearly Net Income"
          icon={<DollarSign className="w-4 h-4" />}
          value={yearlyIncome}
          onChange={handleIncomeChange}
          placeholder="Enter your yearly income"
        />

        <InputField
          id="daily-hours"
          label="Daily Working Hours"
          icon={<Clock className="w-4 h-4" />}
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
          placeholder="Enter daily hours worked"
          type="number"
          min="0"
          max="24"
        />

        <InputField
          id="item-price"
          label="Item/Service Price"
          icon={<ShoppingCart className="w-4 h-4" />}
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          placeholder="Enter price"
          type="number"
          min="0"
        />

        <div className="flex items-center space-x-2 bg-secondary/50 p-3 rounded-lg">
          <Checkbox 
            id="recurring" 
            checked={isRecurring} 
            onCheckedChange={setIsRecurring}
            className="bg-background border-primary"
          />
          <Label htmlFor="recurring" className="text-sm font-medium cursor-pointer">
            Monthly Recurring Payment
          </Label>
        </div>

        <Button
          onClick={calculateWorkingHours}
          className="w-full"
          variant="default"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Time Cost
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && !error && (
          <Alert className="bg-primary/10 border-primary">
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Your hourly earnings: {formatCurrency(result.hourlyRate)}/hour
                </p>
                {result.isRecurring ? (
                  <>
                    <p className="font-medium text-primary">This will cost you:</p>
                    <p>Monthly: {result.monthlyHours} hours ({result.monthlyDays} working days)</p>
                    <p>Yearly: {result.yearlyHours} hours ({result.yearlyDays} working days)</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-primary">This will cost you:</p>
                    <p>{result.hours} hours ({result.days} working days)</p>
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeCostCalculator;