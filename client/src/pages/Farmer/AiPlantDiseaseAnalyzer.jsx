import React, { useState, useEffect } from "react";
import {
  Loader,
  AlertTriangle,
  CheckCircle,
  Leaf,
  AlertCircle,
  Info,
  Zap,
  Shield,
  UploadCloud,
  Globe,
} from "lucide-react";
import { analyzePlantImage } from "../../apis/aiApi/";

const STORAGE_KEY = "aiPlantAnalyzerState";

const AiPlantDiseaseAnalyzer = () => {
  // States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [translatedResult, setTranslatedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [language, setLanguage] = useState("en");

  // Load state from storage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { imageB64, result, tab, lang, translated } = JSON.parse(saved);
        setImageBase64(imageB64);
        setSelectedImage(
          imageB64 ? `data:image/jpeg;base64,${imageB64}` : null
        );
        setAnalysisResult(result);
        setTranslatedResult(translated);
        if (tab) setActiveTab(tab);
        if (lang) setLanguage(lang);
      }
    } catch (err) {
      console.error("Failed to load saved state:", err);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save state to storage
  useEffect(() => {
    try {
      const stateToSave = {
        imageB64: imageBase64,
        result: analysisResult,
        tab: activeTab,
        lang: language,
        translated: translatedResult,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error("Failed to save state:", err);
    }
  }, [imageBase64, analysisResult, activeTab, language, translatedResult]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);


  // Helper to fetch translation for a single string
  const fetchTranslation = async (text) => {
    if (!text || typeof text !== "string") return text;
    try {
      // Using the free 'gtx' endpoint used by browser extensions
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=gu&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      // data[0][0][0] contains the translated text
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0].map((item) => item[0]).join(""); // Join parts if translation is split
      }
      return text;
    } catch (err) {
      console.error("Translation API fetch error:", err);
      return text; // Fallback to English
    }
  };

  const translateToGujarati = async (englishResult) => {
    if (!englishResult) return;

    setIsTranslating(true);
    setError(null);

    try {
      // 1. Translate simple strings
      const tSummary = await fetchTranslation(englishResult.summary);
      const tDisease = await fetchTranslation(englishResult.disease);
      const tPlantType = await fetchTranslation(englishResult.plantType);

      // 2. Helper to translate arrays (joins with delimiter to save requests)
      const translateArray = async (arr) => {
        if (!arr || arr.length === 0) return [];
        // Join with a unique delimiter that won't likely appear in text
        const joined = arr.join(" ||| ");
        const translated = await fetchTranslation(joined);
        // Split back by the translated delimiter (Google might translate the delimiter spaces)
        return translated.split("|||").map((s) => s.trim());
      };

      // 3. Translate the lists in parallel
      const [tSymptoms, tCauses, tSuggestions, tPrevention] = await Promise.all(
        [
          translateArray(englishResult.symptoms),
          translateArray(englishResult.causes),
          translateArray(englishResult.suggestions),
          translateArray(englishResult.prevention),
        ]
      );

      // 4. Construct final object
      const finalTranslation = {
        ...englishResult,
        plantType: tPlantType,
        disease: tDisease,
        summary: tSummary,
        symptoms: tSymptoms,
        causes: tCauses,
        suggestions: tSuggestions,
        prevention: tPrevention,
        // Keep these original
        healthy: englishResult.healthy,
        confidence: englishResult.confidence,
        severity: englishResult.severity,
      };

      setTranslatedResult(finalTranslation);
      setLanguage("gu");
    } catch (err) {
      console.error("Translation logic failed:", err);
      setError("ભાષાંતર નિષ્ફળ (Translation failed). Showing English results.");
      setLanguage("en");
    } finally {
      setIsTranslating(false);
    }
  };

  const getCurrentResult = () =>
    language === "gu" && translatedResult ? translatedResult : analysisResult;

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size exceeds 5MB limit.");
        return;
      }

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setImageBase64(base64);
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setAnalysisResult(null);
      setTranslatedResult(null);
      setLanguage("en");
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange({ target: { files: [file] } });
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzePlantImage(imageFile);
      setAnalysisResult(result);
      setTranslatedResult(null);
      setLanguage("en");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    if (selectedImage && selectedImage.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageBase64(null);
    setImageFile(null);
    setAnalysisResult(null);
    setTranslatedResult(null);
    setError(null);
    setActiveTab("summary");
    setLanguage("en");
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const currentResult = getCurrentResult();
  const isResultsReady = !!currentResult;

  const langOptions = [
    { key: "en", label: "English", icon: <Globe className="w-4 h-4" /> },
    {
      key: "gu",
      label: "ગુજરાતી",
      icon: <Globe className="w-4 h-4 rotate-12" />,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      <main className="flex-1 p-4 sm:p-6 overflow-auto bg-emerald-50">
        <div className="max-w-6xl mx-auto">
          {/* Language Toggle */}
          {isResultsReady && (
            <div className="mb-4 sm:mb-6 bg-white rounded-xl shadow-sm p-3 flex justify-center border border-gray-200">
              <div className="flex space-x-2">
                {langOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      if (
                        opt.key === "gu" &&
                        language === "en" &&
                        analysisResult
                      ) {
                        translateToGujarati(analysisResult);
                      } else if (opt.key === "en") {
                        setLanguage("en");
                      }
                    }}
                    disabled={
                      isTranslating || (opt.key === "gu" && !analysisResult)
                    }
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      language === opt.key
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {opt.icon}
                    <span className="ml-1">{opt.label}</span>
                    {isTranslating && opt.key === "gu" && (
                      <Loader className="ml-2 w-4 h-4 animate-spin" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Upload a clear image of your plant&apos;s leaf or crop for instant
            AI-powered analysis and expert suggestions.
          </p>

          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg space-y-6">
            {/* Upload Section */}
            <section className="w-full">
              <div
                className={`relative w-full h-48 sm:h-64 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedImage
                    ? "border-green-400 bg-white shadow-md"
                    : "border-dashed border-green-300 bg-green-50 hover:bg-green-100 cursor-pointer hover:shadow-sm"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                role={selectedImage ? undefined : "button"}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <Loader className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                )}

                {!selectedImage ? (
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors duration-200"
                  >
                    <UploadCloud className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mb-2 sm:mb-3 shrink-0" />
                    <p className="mb-1 text-xs sm:text-sm text-gray-500 font-semibold">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB)
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                ) : (
                  <>
                    <img
                      src={selectedImage}
                      alt="Selected plant for analysis"
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      onClick={clearAnalysis}
                      className="absolute top-3 right-3 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {selectedImage && (
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={analyzeImage}
                    disabled={isLoading}
                    className="flex-1 max-w-md bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        Analyze Plant
                      </>
                    )}
                  </button>
                  {!isLoading && (
                    <button
                      onClick={clearAnalysis}
                      className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 text-sm animate-fade-in">
                  <AlertTriangle className="mr-2 w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </section>

            {/* Results Section */}
            <section className="w-full space-y-4">
              {!isResultsReady ? (
                <div className="h-64 sm:h-96 flex items-center justify-center text-gray-400 p-4 rounded-xl bg-gray-50/50">
                  <div className="text-center animate-pulse">
                    <Leaf className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50 text-green-300" />
                    <p className="text-base sm:text-lg font-medium">
                      Upload an image to begin analysis
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      Get expert insights on plant health in seconds
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center flex-wrap justify-center">
                      Analysis Complete
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                          currentResult.healthy
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {currentResult.disease} ({currentResult.confidence}%
                        Confidence)
                      </span>
                    </h2>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${
                          currentResult.confidence > 80
                            ? "bg-green-600"
                            : currentResult.confidence > 50
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${currentResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto space-x-1 pb-2 -mb-px">
                      {[
                        {
                          key: "summary",
                          icon: Info,
                          label: language === "en" ? "Summary" : "સારાંશ",
                        },
                        {
                          key: "details",
                          icon: AlertCircle,
                          label:
                            language === "en"
                              ? "Symptoms & Causes"
                              : "લક્ષણો અને કારણો",
                        },
                        {
                          key: "advice",
                          icon: Zap,
                          label:
                            language === "en"
                              ? "Suggestions & Prevention"
                              : "સૂચનો અને નિવારણ",
                        },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`shrink-0 py-3 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap transition-colors duration-200 ${
                            activeTab === tab.key
                              ? "border-green-500 text-green-600 shadow-sm"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <tab.icon className="w-4 h-4 mr-2 shrink-0" />
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="pt-2 sm:pt-4 space-y-4">
                    {activeTab === "summary" && (
                      <div className="p-6 bg-linear-to-br from-gray-50 to-white rounded-xl shadow-inner border border-gray-100 text-sm">
                        <h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-800 flex items-center justify-center">
                          <Info className="mr-2 w-5 h-5 text-blue-600" />
                          Plant Type:{" "}
                          <span className="ml-1 font-normal">
                            {currentResult.plantType ||
                              (language === "en" ? "Unspecified" : "અનિશ્ચિત")}
                          </span>
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-sm prose max-w-none">
                          {currentResult.summary}
                        </p>
                        <p className="mt-4 text-xs sm:text-sm text-gray-500 flex items-center justify-center">
                          Severity:
                          <span
                            className={`ml-2 font-medium px-2 py-1 rounded-full text-xs ${
                              currentResult.severity === "low"
                                ? "text-green-600 bg-green-100"
                                : currentResult.severity === "medium"
                                ? "text-yellow-600 bg-yellow-100"
                                : "text-red-600 bg-red-100"
                            }`}
                          >
                            {currentResult.severity?.toUpperCase() || "N/A"}
                          </span>
                        </p>
                      </div>
                    )}

                    {activeTab === "details" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100 text-sm">
                          <h3 className="font-semibold text-base sm:text-lg mb-3 text-blue-800 flex items-center">
                            <AlertCircle className="mr-2 w-5 h-5" />
                            {language === "en" ? "Symptoms" : "લક્ષણો"}
                          </h3>
                          <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            {currentResult.symptoms?.map((symptom, i) => (
                              <li key={i} className="text-sm pl-2">
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-5 bg-yellow-50/50 rounded-xl border border-yellow-100 text-sm">
                          <h3 className="font-semibold text-base sm:text-lg mb-3 text-yellow-800 flex items-center">
                            <AlertCircle className="mr-2 w-5 h-5" />
                            {language === "en" ? "Causes" : "કારણો"}
                          </h3>
                          <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            {currentResult.causes?.map((cause, i) => (
                              <li key={i} className="text-sm pl-2">
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "advice" && (
                      <div className="space-y-4">
                        <div className="p-5 bg-green-50/50 rounded-xl border border-green-100 text-sm">
                          <h3 className="font-semibold text-base sm:text-lg mb-3 text-green-800 flex items-center">
                            <CheckCircle className="mr-2 w-5 h-5" />
                            {language === "en"
                              ? "Treatment Suggestions"
                              : "ઉપચાર સૂચનો"}
                          </h3>
                          <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                            {currentResult.suggestions?.map((suggestion, i) => (
                              <li key={i} className="pl-3 text-sm">
                                {suggestion}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm">
                          <h3 className="font-semibold text-base sm:text-lg mb-3 text-indigo-800 flex items-center">
                            <Shield className="mr-2 w-5 h-5" />
                            {language === "en"
                              ? "Prevention Tips"
                              : "નિવારણ ટિપ્સ"}
                          </h3>
                          <ul className="space-y-2 text-gray-700 list-disc list-inside">
                            {currentResult.prevention?.map((tip, i) => (
                              <li key={i} className="pl-2 text-sm">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AiPlantDiseaseAnalyzer;
