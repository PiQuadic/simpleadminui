import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import userThree from '../images/user/user-03.png';

const Settings = () => {
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Promotion" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Company Information
                </h3>
              </div>
              <div className="p-7 text-center">
                <p className="p-3">
                  PiQuadic is a small company of passionate individuals who want to make gardening simple and accessible.
                </p>
                <p className="p-3">
                  Our goal is to help you learn to grow in an urban setting in a way that fits your unique and busy lifestyle, so you can have fresh foods or thriving plants without the headache of traditional gardening and even if you don’t have hours to dedicate to your craft.
                </p>
                <a
                  className='text-blue-900 hover:text-green'
                  href="https://piquadic.com"
                  target='_blank'
                  rel="noopener"
                  aria-label='PiQuadic'
                >
                  https://piquadic.com
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    <img src={userThree} alt="User" />
                  </div>
                  <div>
                    <span className="mb-1.5 text-black dark:text-white">
                      Edit
                    </span>
                    <span className="flex gap-2.5">
                      <button className="text-sm hover:text-primary">
                        Delete
                      </button>
                      <button className="text-sm hover:text-primary">
                        Update
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
