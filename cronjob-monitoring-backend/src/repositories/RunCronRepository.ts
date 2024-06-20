import axios from 'axios';

export class RunCronRepository {
  static runPayslip = async (date:any, npp:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:{ date_now?: string, npp?: string } = {}

    if (date) {
      params.date_now = date
    }

    if (npp) {
      params.npp = npp
    }

    const response = await axios.post(`${process.env.CRON_HOST_URL}/cron/payslip`, params, config);
    return response.data
  }
  
  static runMasaKerja = async (employeeId:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/masa-kerja?employee_id=${employeeId}`, config);
    return response.data
  }
  
  static runOmAction = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;

    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/om-action${finalParams}`, config);
    return response.data
  }

  static runOrgLeader = async (date:any, objectId:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (objectId) {
      params.push(`object_id=${objectId}`)
    }

    const finalParams = `?${params.join('&')}`;

    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/org-leader${finalParams}`, config);
    return response.data
  }

  static runEducation = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;

    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/education${finalParams}`, config);
    return response.data
  }

  static runFamily = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;

    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/family${finalParams}`, config);
    return response.data
  }
  
  static runPersonalData = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/profile/personal-data${finalParams}`, config);
    return response.data
  }
  
  static runPersonalID = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/profile/personal-id${finalParams}`, config);
    return response.data
  }
  
  static runBpjsKes = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/profile/bpjs-kes${finalParams}`, config);
    return response.data
  }
  
  static runBpjsTK = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/profile/bpjs-tk${finalParams}`, config);
    return response.data
  }
  
  static runTaxId = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/profile/tax-id${finalParams}`, config);
    return response.data
  }
  
  static runAddress = async (date:any, persNumber:any):Promise<any> => {
    const config = {
      headers: {
        'X-API-KEY': process.env.CRON_API_KEY
      },
    };

    let params:string[] = []

    if (date) {
      params.push(`changedate=${date}`)
    }

    if (persNumber) {
      params.push(`personnel_number=${persNumber}`)
    }

    const finalParams = `?${params.join('&')}`;
    const response = await axios.get(`${process.env.CRON_HOST_URL}/cron/profile/address${finalParams}`, config);
    return response.data
  }
}