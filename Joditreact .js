import JoditEditor from "jodit-react";
import { useDispatch} from "react-redux";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import axiosInstance from "../../Services/Interceptor";
import Tokenvalidation from "../../Authentication/Tokenvalidation";
import { getFAQData } from "../../Redux/Actions/Configuration/FAQAction";

const FAQModal = ({
  reset,
  errors,
  control,
  btnState,
  register,
  setValue,
  showModal,
  setBtnState,
  setShowModal,
  handleSubmit,
  updateFAQData,
  setUpdateFAQData,
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const config = {
    placeholder: t("CommonBtn.placeholder2"),
  };

 

  useEffect(() => {
    reset(updateFAQData);
  }, [updateFAQData]);

  const handleCloseModal = () => {
    setUpdateFAQData({});
    setShowModal(false);
    reset();
  };

  const onSubmit = (data) => {
    Tokenvalidation();
    let datas = {
      questionBn: data?.questionBn,
      questionEn: data?.questionBn,
      answerBn: data?.answer,
      answerEn: data?.answer,
      statusId: data?.statusId,
    };

    if (btnState === "update") {
      axiosInstance
        .put(`/miscellaneous-service/api/v1/faqs/${updateFAQData.id}`, datas)
        .then((res) => {
          console.log(res);
          if (res?.status === 200) {
            dispatch(getFAQData());
            setUpdateFAQData({});
            setShowModal(false);

            toast.success("সম্পাদনা করা হয়েছে", {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: false,
              autoClose: 1000,
              theme: "colored",
            });
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      //create
      axiosInstance
        .post("/miscellaneous-service/api/v1/faqs/create", datas)
        .then((res) => {
          dispatch(getFAQData());
          setShowModal(false);
          toast.success("সম্পাদনা করা হয়েছে", {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 1000,
            theme: "colored",
          });
        })
        .catch((err) => {
          console.log(err.response.data.message, "err");
          toast.error(err.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
            hideProgressBar: false,
            autoClose: 1000,
            theme: "colored",
          });
        });
    }
  };

  return (
    <div>
      <Col lg={4} md={6} sm={4}>
        <Modal
          size="lg"
          show={showModal}
          centered
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                {t("Common.faq")}
              </Modal.Title>
              <Button
                variant=""
                className="btn btn-close btn-danger m-0 p-1"
                onClick={handleCloseModal}
              >
                X
              </Button>
            </Modal.Header>
            <Modal.Body>
              <div className="pd-30 pd-sm-20">
                <div className="fileUploads">
                  {/* Title BN*/}
                  <Row className="row-xs align-items-center mg-b-20">
                    <Col md={12}>
                      <Form.Label className="form-label mg-b-0 mb-2 text-dark fw-bolder">
                        {t("FAQCreate.Questions")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                   
                      <Form.Control
                        as="input"
                        placeholder={t("FAQCreate.Qes_Placeholder")}
                        style={{ height: "50px" }}
                        type="text"
                        defaultValue={updateFAQData?.questionBn}
                        {...register("questionBn", {
                          required: true,
                        })}
                      />

                      {errors?.nameBn?.type === "required" && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "16px" }}
                        >
                          {i18n.language === "en"
                            ? " Name (Bangla) Required"
                            : "এই তথ্যটি আবশ্যক"}
                        </span>
                      )}
                    </Col>
                  </Row>
                  {/* Answer BN*/}
                  <Row className="row-xs align-items-center mg-b-20">
                    <Col md={12}> 
                      <Form.Label className="form-label text-dark  mb-2 mt-0  fw-bolder">
                        {t("FAQCreate.Answers")}
                      </Form.Label>
                
                      <Controller
                        name="answer"
                        control={control}
                        rules={{ required: "This field is required." }}
                        render={({ field }) => (
                          <JoditEditor
                            value={updateFAQData?.answerBn}
                            config={config}
                            onChange={(newValue) => field.onChange(newValue)}
                          />
                        )}
                      />
                      {errors?.description?.type === "required" && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "16px" }}
                        >
                          {i18n.language === "en"
                            ? " Required"
                            : "এই তথ্যটি আবশ্যক"}
                        </span>
                      )}
                    </Col>
                  </Row>

                  {/* Status field */}
                  <Row className="row-xs align-items-center mg-b-20 mt-5">
                    <Col md={4}>
                      <Form.Label className="form-label mg-b-0 text-dark fw-bolder m-0">
                        {t("FAQCreate.status")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                    </Col>
                    <Col md={8}> 
                      <Form.Check
                        inline
                        label={t("FAQCreate.status1")}
                        {...register("statusId", { required: true })}
                        type="radio"
                        value={1}
                        checked={true}
                      />
                      <Form.Check
                        inline
                        label={t("FAQCreate.status2")}
                        {...register("statusId", { required: true })}
                        type="radio"
                        value={2}
                      />

                      {errors?.statusId?.type === "required" && (
                        <span
                          className="text-danger"
                          style={{ fontSize: "16px" }}
                        >
                          <br />{" "}
                          {i18n.language === "en"
                            ? " Required"
                            : "এই তথ্যটি আবশ্যক"}
                        </span>
                      )}
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  variant=""
                  className="btn btn-secondary  mg-r-5 pd-x-30 mg-t-5"
                  onClick={handleCloseModal}
                >
                  {t("CommonBtn.close")}
                </Button>

                <Button
                  variant=""
                  type="submit"
                  className="btn btn-primary pd-x-30 mg-r-5 mg-t-5"
                >{
                    btnState === "add" ? t("CommonBtn.create") : t("CommonBtn.create")

                  }
                </Button> 
           </div>
            </Modal.Body>
            
          </form>
        </Modal>
      </Col>
     
    </div>
  );
};

export default FAQModal;
